import type { NextFunction, Request, Response } from "express";

export const GlobalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // const isDev = env.nodeEnv === "dev";
    const isDev = true;
    const statusCode = err.status ?? err.cause?.status ?? 500;
    const message = err.message ?? "something went wrong";

    res.status(statusCode).json({
        success: false,
        message,
        ...(isDev && { stack: err.stack }),
        ...(isDev && { extra: err.cause?.extra }),
    });
};
