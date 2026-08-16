import {
    BadRequestException,
    compareText,
    ConflictException,
    GenderEnum,
    generateOtp,
    hashText,
    IUser,
    otpEmailTemplate,
    ProviderEnum,
    RoleEnum,
    sendEmail,
    TokenPayload,
    UnauthorizedException,
} from "../../common";
import {
    generateAccessToken,
    generateToken,
} from "../../common/utils/token.utils";
import userModel from "../../database/models/user.model";
import * as RedisClient from "../../database/redis/redis.service";
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

    async login(data: type.loginDto, host?: string) {
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

    async verifyEmail(data: type.verifyEmailDto) {
        const { email, otp } = data;
        const user = await userModel.findOne({ email });
        if (!user) throw new BadRequestException("Email not found");

        if (user.isVerified)
            throw new UnauthorizedException("Email already verified");

        const hashedOtp = await RedisClient.get(`otp:${user._id}`);

        if (!hashedOtp) throw new BadRequestException("Invalid or expired otp");

        const isMatch = await compareText({
            plainText: otp,
            cypherText: hashedOtp,
        });

        if (!isMatch) throw new UnauthorizedException("Invalid or expired otp");

        user.isVerified = true;
        await user.save();

        await RedisClient.del(`otp:${user._id}`);

        return 1;
    }
}

export default new AuthService();
