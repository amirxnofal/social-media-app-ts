import mongoose from "mongoose";
import { IUser, GenderEnum, ProviderEnum, RoleEnum } from "../../common";

const userSchema = new mongoose.Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        phone: { type: String, required: true },
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
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

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
