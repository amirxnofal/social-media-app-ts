import { GenderEnum, ProviderEnum, RoleEnum } from "../../common";

export interface IUser {
    username: string;
    firstName: string;
    lastName?: string | undefined;
    email: string;
    phone: string;
    password: string;
    isVerified: boolean;
    fullName?: string;
    gender?: GenderEnum;
    provider?: ProviderEnum;
    role: RoleEnum;
}
