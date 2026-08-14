import rateLimit from "express-rate-limit";

export const limiter = (
    minutes: number = 15,
    limit: number = 100,
    message: string = "Too many requests, please try again later.",
) => {
    return rateLimit({
        windowMs: minutes * 60 * 1000,
        limit: limit,
        message: message,
    });
};
