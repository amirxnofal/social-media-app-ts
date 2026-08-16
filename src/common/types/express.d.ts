import { RoleEnum } from "../enums/user.enum";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: RoleEnum;
            };
        }
    }
}

export {};