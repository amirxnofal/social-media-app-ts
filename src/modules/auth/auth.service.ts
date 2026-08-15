import {
    BadRequestException,
    ConflictException,
    GenderEnum,
    generateOtp,
    hashText,
    IUser,
    otpEmailTemplate,
    ProviderEnum,
    RoleEnum,
    sendEmail,
} from "../../common";
import userModel from "../../database/models/user.model";
import * as RedisClient from "../../database/redis/redis.service";

class AuthService {
    async register(data: IUser) {
        const {
            username,
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
        } = data;

        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) throw new ConflictException("Email already exist");

        const isUsernameExist = await userModel.findOne({ username });
        if (isUsernameExist) throw new ConflictException("user already exist");

        const isPhoneExist = await userModel.findOne({ phone });
        if (isPhoneExist) throw new ConflictException("Phone already exist");

        const hashedPassword = await hashText({ plainText: password });

        const user = await userModel.create({
            username,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            confirmEmail: false,
            gender:
                gender === GenderEnum.Male
                    ? GenderEnum.Male
                    : GenderEnum.Female,
            provider: ProviderEnum.System,
            role: RoleEnum.User,
        });

        const otp = generateOtp(6);
        const hashedOtp = await hashText({ plainText: otp });

        await RedisClient.set({
            key: `otp:${user._id}`,
            value: hashedOtp,
            ttl: 5 * 60,
        });

        await sendEmail({
            to: email,
            subject: "OTP Verification",
            html: otpEmailTemplate(otp),
        });

        return user;
    }

    async returnAll() {
        const users = await userModel.find();
        return users;
    }
}

export default new AuthService();
