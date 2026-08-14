import { GenderEnum, ProviderEnum, RoleEnum } from "../../common";

export interface IUser {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmEmail: boolean;
    gender?: GenderEnum;
    provider?: ProviderEnum;
    role?: RoleEnum;
}
