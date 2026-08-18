import { Types } from "mongoose";
import { TokenType } from "../../database/redis/redis.service";

export class RedisKeys {
    static verifyEmail(userId: string | Types.ObjectId): string {
        return `verify-email:${userId}`;
    }

    static resetPassword(userId: string | Types.ObjectId): string {
        return `reset-password:${userId}`;
    }

    static revokedToken(type: TokenType, jti: string): string {
        return `revoked:${type}:${jti}`;
    }
}
