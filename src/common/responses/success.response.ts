import { Response } from "express";
import { SuccessResponseParams } from "../index";

export const SuccessResponse = ({
    res,
    statusCode = 200,
    message = "success",
    data,
    token,
    extra,
}: SuccessResponseParams): Response => {
    return res
        .status(statusCode)
        .json({ success: true, message, data, token, extra });
};
