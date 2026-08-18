import { RedisKeys } from "../../common";
import { client } from "./redis";
import { DecodedToken } from "../../common/interfaces/token.interface";


export const get = async (key: string) => {
    return await client.get(key);
};

export const set = async ({
    key,
    value,
    ttl,
}: {
    key: string;
    value: string;
    ttl: number;
}) => {
    return await client.set(key, value, { EX: ttl });
};

export const mGet = async (...keys: string[]) => {
    return await client.mGet(keys);
};

export const exists = async (key: string) => {
    return await client.exists(key);
};

export const ttl = async (key: string) => {
    return await client.ttl(key);
};

export const del = async (key: string) => {
    return await client.del(key);
};

export type TokenType = "access" | "refresh";

export const isTokenBlacklisted = async (
    jti: string,
    type: TokenType,
): Promise<boolean> => {
    const result = await exists(`revoked:${type}:${jti}`);
    return result === 1;
};

export const createRevokeToken = async (
    decoded: DecodedToken,
    type: TokenType,
) => {
    const now = Math.floor(Date.now() / 1000);
    const tokenTtl = decoded.exp - now;

    if (!decoded?.jti || tokenTtl <= 0) return null;

    await set({
        key: RedisKeys.revokedToken(type, decoded.jti),
        value: "1",
        ttl: tokenTtl,
    });

    return decoded.jti;
};
