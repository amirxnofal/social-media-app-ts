import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) });

function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

const port = getEnvVar("PORT");
const mongodbUri = getEnvVar("MONGODB_URI");
const redisUrl = getEnvVar("REDIS_URL");
const saltRound = getEnvVar("SALT_ROUND");
const googleAppEmail = getEnvVar("GOOGLE_APP_EMAIL");
const googleAppPassword = getEnvVar("GOOGLE_APP_PASSWORD");
const emailSenderName = getEnvVar("EMAIL_SENDER_NAME");

const jwtUserAccessSecret = getEnvVar("JWT_USER_ACCESS_SECRET");
const jwtUserRefreshSecret = getEnvVar("JWT_USER_REFRESH_SECRET");
const jwtAdminAccessSecret = getEnvVar("JWT_ADMIN_ACCESS_SECRET");
const jwtAdminRefreshSecret = getEnvVar("JWT_ADMIN_REFRESH_SECRET");

const nodeEnv = process.env.NODE_ENV || "dev";
const jwtAccessExpiry = process.env.ACCESS_EXPIRY || "15m";
const jwtRefreshExpiry = process.env.REFRESH_EXPIRY || "7d";
const appName = process.env.APP_NAME || "social-media-app";

export const env = {
    port,
    mongodbUri,
    saltRound,
    googleAppEmail,
    googleAppPassword,
    emailSenderName,
    nodeEnv,
    redisUrl,
    jwtUserAccessSecret,
    jwtUserRefreshSecret,
    jwtAdminAccessSecret,
    jwtAdminRefreshSecret,
    jwtAccessExpiry,
    jwtRefreshExpiry,
    appName,
};