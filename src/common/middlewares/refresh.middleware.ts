import { Request, Response, NextFunction } from "express";
import * as error from "../responses/error.response";
import { DecodedToken } from "../interfaces/token.interface";
import { isTokenBlacklisted } from "../../database/redis/redis.service";
import tokenService from "../utils/token.utils";

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
        decoded = tokenService.verifyRefreshToken(token, req.get("host"));
    } catch (err) {
        return next(new error.ExpiredOrInvalidTokenException());
    }

    if (await isTokenBlacklisted(decoded.jti, "refresh")) {
        return next(new error.UnauthorizedException("Token revoked"));
    }

    req.newAccessToken = tokenService.generateAccessToken({
        userId: decoded.userId,
        role: decoded.role,
        host: typeof decoded.aud === "string" ? decoded.aud : undefined,
    });

    next();
};
