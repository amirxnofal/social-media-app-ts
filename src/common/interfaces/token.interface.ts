import { JwtPayload } from "jsonwebtoken";
import { RoleEnum } from "../enums/user.enum";

export interface TokenPayload {
    userId: string;
    role: RoleEnum;
    host?: string;
}

export interface DecodedToken extends JwtPayload {
    userId: string;
    role: RoleEnum;
    jti: string;
}