import type { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.service";

export const GlobalErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const isDev = env.nodeEnv === "dev";
    const statusCode = err.status ?? err.cause?.status ?? 500;
    const message = err.message ?? "something went wrong";

    res.status(statusCode).json({
        success: false,
        message,
        ...(isDev && { stack: err.stack }),
        ...(isDev && { extra: err.cause }),
    });
};
