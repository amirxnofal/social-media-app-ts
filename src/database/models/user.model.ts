import mongoose from "mongoose";
import { IUser, GenderEnum, ProviderEnum, RoleEnum } from "../../common";

const userSchema = new mongoose.Schema<IUser>(
    {
        firstName: { type: String },
        lastName: { type: String },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        phone: { type: String },
        password: {
            type: String,
            required: function (): boolean {
                return this.provider === ProviderEnum.System;
            },
            select: false,
        },
        confirmEmail: {
            type: Boolean,
            default: false,
        },
        gender: {
            type: String,
            default: GenderEnum.Male,
        },
        provider: {
            type: String,
            default: ProviderEnum.System,
        },
        role: {
            type: String,
            default: RoleEnum.User,
        },
    },
    { timestamps: true },
);

userSchema
    .virtual("username")
    .set(function (value) {
        const [firstName, lastName] = value.split(" ");
        this.firstName = firstName;
        this.lastName = lastName;
    })
    .get(function () {
        return `${this.firstName} ${this.lastName}`;
    });

export default mongoose.model<IUser>("User", userSchema);
