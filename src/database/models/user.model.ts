import mongoose from "mongoose";
import {
    IUser,
    GenderEnum,
    ProviderEnum,
    RoleEnum,
    UserStatusEnum,
} from "../../common";

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function (): boolean {
            return this.provider === ProviderEnum.System;
        },
        select: false,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: UserStatusEnum.Inactive,
    },

    gender: {
        type: String,
        enum: Object.values(GenderEnum),
        required: true,
    },
    provider: {
        type: String,
        default: ProviderEnum.System,
    },
    role: {
        type: String,
        default: RoleEnum.User,
    },

    profilePic: {
        type: String,
    },
    coverPic: {
        type: [String],
        default: undefined,
    },
    bio: {
        type: String,
    },
});

userSchema
    .virtual("fullName")
    .set(function (value) {
        const [firstName, lastName] = value.split(" ");
        this.firstName = firstName;
        this.lastName = lastName;
    })
    .get(function () {
        return `${this.firstName} ${this.lastName}`;
    });

export default mongoose.model<IUser>("User", userSchema);
