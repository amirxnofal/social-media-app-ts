import { Document } from "mongoose";
import {
    GenderEnum,
    ProviderEnum,
    RoleEnum,
    UserStatusEnum,
} from "../../common";

export interface IUser extends Document {
    username: string;
    fullName?: string;
    firstName: string;
    lastName?: string;

    email: string;
    phone: string;
    password?: string;

    isVerified: boolean;
    status: UserStatusEnum;

    gender: GenderEnum;
    provider: ProviderEnum;
    role: RoleEnum;

    profilePic?: string;
    coverPic?: string[];
    bio: string;
}
