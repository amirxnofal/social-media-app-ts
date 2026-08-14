import { Response } from "express";

export interface SuccessResponseParams {
    res: Response;
    statusCode?: number;
    message?: string;
    data?: any;
    token?: string;
    extra?: any;
}
