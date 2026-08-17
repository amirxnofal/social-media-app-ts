import { Request, Response, NextFunction } from "express";
import * as error from "../responses/error.response";
import { DecodedToken } from "../interfaces/token.interface";
import { isTokenBlacklisted } from "../../database/redis/redis.service";
import tokenService from "../utils/token.utils";

export const authenticate = async (
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
        decoded = tokenService.verifyAccessToken(token, req.get("host"));
    } catch (err) {
        return next(
            new error.ExpiredOrInvalidTokenException()
        );
    }

    if (await isTokenBlacklisted(decoded.jti, "access")) {
        return next(new error.UnauthorizedException("Token revoked"));
    }

    req.user = { userId: decoded.userId, role: decoded.role };
    next();
};
