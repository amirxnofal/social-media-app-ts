import { GenderEnum, ProviderEnum, RoleEnum } from "../../common";

export interface IUser {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmEmail: boolean;
    fullName?: string;
    gender?: GenderEnum;
    provider?: ProviderEnum;
    role?: RoleEnum;
}
