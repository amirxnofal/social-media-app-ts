import { RoleEnum } from "../index";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: RoleEnum;
            };
            newAccessToken?: string;
        }
    }
}

export {};
