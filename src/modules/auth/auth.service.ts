import {
    BadRequestException,
    compareText,
    ConflictException,
    GenderEnum,
    generateToken,
    hashText,
    ProviderEnum,
    REDIS_KEYS,
    RoleEnum,
    TokenPayload,
    UnauthorizedException,
} from "../../common";
import userModel from "../../database/models/user.model";
import * as RedisClient from "../../database/redis/redis.service";
import { generateAndSendOtp } from "./auth.helper";
import * as type from "./auth.validation";

class AuthService {
    async register(data: type.RegisterDto) {
        const {
            username,
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
        } = data;

        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }, { phone }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException("Email already exists");
            }
            if (existingUser.username === username) {
                throw new ConflictException("Username already exists");
            }
            if (existingUser.phone === phone) {
                throw new ConflictException("Phone already exists");
            }
        }

        const hashedPassword = await hashText({ plainText: password });

        const user = await userModel.create({
            username,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            isVerified: false,
            gender:
                gender === GenderEnum.Male
                    ? GenderEnum.Male
                    : GenderEnum.Female,
            provider: ProviderEnum.System,
            role: RoleEnum.User,
        });

        await generateAndSendOtp(user, "verify-email", "OTP Verification");

        return user;
    }

    async login(data: type.LoginDto, host?: string) {
        const { identifier, password } = data;
        const user = await userModel
            .findOne({
                $or: [{ email: identifier }, { username: identifier }],
            })
            .select("+password");

        if (!user) throw new BadRequestException("Invalid credentials");

        const isMatch = await compareText({
            plainText: password,
            cypherText: user.password,
        });

        if (!isMatch) throw new UnauthorizedException("Invalid credentials");

        if (!user.isVerified)
            throw new UnauthorizedException("Verify email and try again");

        const payload: TokenPayload = {
            userId: user._id.toString(),
            role: user.role,
            host,
        };
        const tokens = generateToken(payload);
        return tokens;
    }

    async verifyEmail(data: type.VerifyEmailDto) {
        const { email, otp } = data;
        const user = await userModel.findOne({ email });
        if (!user) throw new BadRequestException("Email not found");

        if (user.isVerified)
            throw new UnauthorizedException("Email already verified");

        const hashedOtp = await RedisClient.get(
            REDIS_KEYS.verifyEmail(user._id.toString()),
        );

        if (!hashedOtp) throw new BadRequestException("Invalid or expired otp");

        const isMatch = await compareText({
            plainText: otp,
            cypherText: hashedOtp,
        });

        if (!isMatch) throw new UnauthorizedException("Invalid or expired otp");

        user.isVerified = true;
        await user.save();

        await RedisClient.del(REDIS_KEYS.verifyEmail(user._id.toString()));

        return 1;
    }

    async resendOtp(data: type.ResendOtpDto) {
        const { email } = data;

        const user = await userModel.findOne({ email });
        if (!user) throw new BadRequestException("Unable to process request");

        if (user.isVerified) {
            throw new BadRequestException("Email is already verified");
        }

        await generateAndSendOtp(user, "verify-email", "OTP Verification");

        return 1;
    }

    async forgetPassword(data: type.ForgetPasswordDto) {
        const { email } = data;

        const user = await userModel.findOne({ email });
        if (!user) throw new BadRequestException("Invalid request");

        if (!user.isVerified) {
            throw new BadRequestException("Please verify your email first");
        }

        await generateAndSendOtp(user, "reset-password", "Reset Password");

        return 1;
    }

    async resetPassword(data: type.ResetPasswordDto) {
        const { email, otp, newPassword } = data;

        const user = await userModel.findOne({ email });
        if (!user) throw new BadRequestException("Invalid request");

        const hashedOtp = await RedisClient.get(
            REDIS_KEYS.resetPassword(user._id.toString()),
        );
        if (!hashedOtp) throw new BadRequestException("Invalid or expired otp");

        const isMatch = await compareText({
            plainText: otp,
            cypherText: hashedOtp,
        });
        if (!isMatch) throw new UnauthorizedException("Invalid or expired otp");

        user.password = await hashText({ plainText: newPassword });
        await user.save();

        await RedisClient.del(REDIS_KEYS.resetPassword(user._id.toString()));

        return 1;
    }
}

export default new AuthService();
