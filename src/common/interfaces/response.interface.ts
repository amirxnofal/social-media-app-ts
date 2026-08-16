import { Response } from "express";

export interface SuccessResponseParams {
    res: Response;
    statusCode?: number;
    message?: string;
    data?: unknown;
    token?: { accessToken: string; refreshToken?: string };
    extra?: unknown;
}
