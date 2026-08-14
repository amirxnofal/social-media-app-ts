import { type Request, type Response, type NextFunction } from "express";
import { ZodSchema } from "zod";
import { BadRequestException } from "../responses/error.response";

export const Validation = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            throw new BadRequestException(
                "Validation error",
                result.error.issues,
            );
        }

        req.body = result.data;
        next();
    };
};
