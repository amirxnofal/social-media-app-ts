import jwt, { SignOptions } from "jsonwebtoken";
import { DecodedToken, TokenPayload } from "../interfaces/token.interface";
import { randomUUID } from "crypto";
import { env } from "../../config/env.service";

export const generateAccessToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: env.jwtAccessExpiry as SignOptions["expiresIn"],
        issuer: env.appName,
        jwtid: randomUUID(),
    };

    if (payload.host) options.audience = payload.host;

    return jwt.sign(
        { userId: payload.userId, role: payload.role },
        env.jwtAccessSecret,
        options,
    );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: env.jwtRefreshExpiry as SignOptions["expiresIn"],
        issuer: env.appName,
        jwtid: randomUUID(),
    };

    if (payload.host) options.audience = payload.host;

    return jwt.sign(
        { userId: payload.userId, role: payload.role },
        env.jwtRefreshSecret,
        options,
    );
};


export const generateToken = ({ userId, role, host }: TokenPayload) => {
    const accessToken = generateAccessToken({ userId, role, host });
    const refreshToken = generateRefreshToken({ userId, role, host });
    return { accessToken, refreshToken };
};

const verifyToken = (
    token: string,
    secret: string,
    host?: string,
): DecodedToken => {
    return jwt.verify(token, secret, {
        issuer: env.appName,
        audience: host,
    }) as DecodedToken;
};

export const verifyAccessToken = (
    token: string,
    host?: string,
): DecodedToken => {
    return verifyToken(token, env.jwtAccessSecret, host);
};

export const verifyRefreshToken = (
    token: string,
    host?: string,
): DecodedToken => {
    return verifyToken(token, env.jwtRefreshSecret, host);
};
