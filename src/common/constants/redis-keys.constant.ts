import { Types } from "mongoose";

export class RedisKeys {
    static verifyEmail(userId: string | Types.ObjectId): string {
        return `verify-email:${userId}`;
    }

    static resetPassword(userId: string | Types.ObjectId): string {
        return `reset-password:${userId}`;
    }
}
