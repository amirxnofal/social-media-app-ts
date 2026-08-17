// External Packages
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";

// Internal Modules
import { env } from "./config/env.service";
import { databaseConnection } from "./database/connect";
import { RedisConnection } from "./database/redis/redis";
import { GlobalErrorHandler, limiter, SuccessResponse, verifyEmailConnection } from "./common";

// Imported Routes
// import authRoutes from "./modules/auth/auth.route";

export const bootstrap = async (): Promise<void> => {
    const app = express();

    globalMiddlewares(app);

    // Database Connection
    await databaseConnection();
    await RedisConnection();
    await verifyEmailConnection()

    // Health Check Route
    app.get("/check-health", (_req: Request, res: Response) => {
        SuccessResponse({
            res,
            statusCode: 200,
            message: "Server is healthy",
        });
    });

    // Routes
    // app.use("/auth", authRoutes);

    // Dummy urls
    app.use("{*dummy}", (_req, res) => {
        SuccessResponse({
            res,
            statusCode: 200,
            message: "url not found",
        });
    });

    app.use(GlobalErrorHandler);
    
    startServer(app);
};

// Global Middlewares
function globalMiddlewares(app: Express): void {
    app.use(helmet());
    app.use(cors({ origin: "*" }));
    app.use(express.json());
    app.use(limiter());
}

// Start Server
function startServer(app: Express): void {
    app.listen(env.port, () => {
        console.log(`🚀 Server is running on http://localhost:${env.port}`);
    });
}
