import type { NextFunction, Request, Response } from "express";
import * as error from "../responses/error.response";
import { generateAccessToken, verifyRefreshToken } from "../utils/token.utils";
import { isTokenBlacklisted } from "../../database/redis/redis.service";
import { DecodedToken } from "../interfaces/token.interface";

export const refreshAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return next(new error.UnauthorizedException("Token is required"));
    }

    const token = header.split(" ")[1];

    if (!token) {
        return next(new error.UnauthorizedException("Token is required"));
    }

    let decoded: DecodedToken;
    try {
        decoded = verifyRefreshToken(token, req.get("host"));
    } catch (err) {
        return next(
            new error.UnauthorizedException("Invalid or expired token"),
        );
    }

    if (await isTokenBlacklisted(decoded.jti, "refresh")) {
        return next(new error.UnauthorizedException("Token revoked"));
    }

    req.newAccessToken = generateAccessToken({
        userId: decoded.userId,
        role: decoded.role,
        host: typeof decoded.aud === "string" ? decoded.aud : undefined,
    });

    next();
};
