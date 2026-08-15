import { createClient } from "redis";
import { env } from "../../config/env.service";

export const client = createClient({ url: env.redisUrl });

export const RedisConnection = async () => {
    client.on("error", (err) => {
        console.error("❌ Redis Client Error:", err);
    });

    try {
        await client.connect();
        console.log("✅ Connected to Redis");
    } catch (error) {
        console.error("❌ Redis connection error:", error);
        process.exit(1);
    }
};
