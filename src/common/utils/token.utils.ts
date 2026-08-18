import jwt, { SignOptions } from "jsonwebtoken";
import { randomUUID } from "crypto";

import { env } from "../../config/env.service";
import { DecodedToken, RoleEnum, TokenPayload, UnauthorizedException } from "../index";

interface UnverifiedPayload {
    role?: RoleEnum;
}

class TokenService {
    private getAccessSecret(role: RoleEnum): string {
        switch (role) {
            case RoleEnum.Admin:
                return env.jwtAdminAccessSecret;
            case RoleEnum.User:
            default:
                return env.jwtUserAccessSecret;
        }
    }

    private getRefreshSecret(role: RoleEnum): string {
        switch (role) {
            case RoleEnum.Admin:
                return env.jwtAdminRefreshSecret;
            case RoleEnum.User:
            default:
                return env.jwtUserRefreshSecret;
        }
    }

    private buildSignOptions(expiresIn: string, host?: string): SignOptions {
        const options: SignOptions = {
            expiresIn: expiresIn as SignOptions["expiresIn"],
            issuer: env.appName,
            jwtid: randomUUID(),
        };

        if (host) options.audience = host;

        return options;
    }

    generateAccessToken(payload: TokenPayload): string {
        const secret = this.getAccessSecret(payload.role);
        const options = this.buildSignOptions(
            env.jwtAccessExpiry,
            payload.host,
        );

        return jwt.sign(
            { userId: payload.userId, role: payload.role },
            secret,
            options,
        );
    }

    generateRefreshToken(payload: TokenPayload): string {
        const secret = this.getRefreshSecret(payload.role);
        const options = this.buildSignOptions(
            env.jwtRefreshExpiry,
            payload.host,
        );

        return jwt.sign(
            { userId: payload.userId, role: payload.role },
            secret,
            options,
        );
    }

    generateToken({ userId, role, host }: TokenPayload) {
        const accessToken = this.generateAccessToken({ userId, role, host });
        const refreshToken = this.generateRefreshToken({ userId, role, host });
        return { accessToken, refreshToken };
    }

    private verify(
        token: string,
        getSecret: (role: RoleEnum) => string,
        host?: string,
    ): DecodedToken {
        const unverifiedPayload = jwt.decode(token) as UnverifiedPayload | null;

        if (!unverifiedPayload?.role) {
            throw new UnauthorizedException("Invalid token structure");
        }

        const secret = getSecret(unverifiedPayload.role);

        return jwt.verify(token, secret, {
            issuer: env.appName,
            audience: host,
        }) as DecodedToken;
    }

    verifyAccessToken(token: string, host?: string): DecodedToken {
        return this.verify(token, this.getAccessSecret.bind(this), host);
    }

    verifyRefreshToken(token: string, host?: string): DecodedToken {
        return this.verify(token, this.getRefreshSecret.bind(this), host);
    }
}

export default new TokenService();
