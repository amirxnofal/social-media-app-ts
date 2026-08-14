import mongoose from "mongoose";
import { env } from "../config/env.service";

export const databaseConnection = async (): Promise<void> => {
    try {        
        await mongoose.connect(env.mongodbUri as string);
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
