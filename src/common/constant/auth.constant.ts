import { Types } from "mongoose";

export const REDIS_KEYS = {
    verifyEmail: (userId: string | Types.ObjectId) => `verify-email:${userId}`,
    resetPassword: (userId: string | Types.ObjectId) => `reset-password:${userId}`,
};