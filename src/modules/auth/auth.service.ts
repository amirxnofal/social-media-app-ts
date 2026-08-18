import * as RedisClient from "../../database/redis/redis.service";
import {
    BadRequestException,
    compareText,
    ConflictException,
    DecodedToken,
    GenderEnum,
    hashText,
    IUser,
    ProviderEnum,
    RoleEnum,
    TokenPayload,
    UnauthorizedException,
    UserStatusEnum,
} from "../../common";
import userModel from "../../database/models/user.model";
import { DatabaseRepository } from "../../database/repository/database.repository";
import { generateAndSendOtp } from "./auth.helper";
import * as type from "./auth.validation";
import tokenService from "../../common/utils/token.utils";
import { RedisKeys } from "../../common";
class AuthService {
    private userRepository: DatabaseRepository<IUser>;
    constructor() {
        this.userRepository = new DatabaseRepository(userModel);
    }

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

        const user = await this.userRepository.create({
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

        const user = await this.userRepository.findOne(
            { $or: [{ email: identifier }, { username: identifier }] },
            { select: "+password" },
        );
        if (!user) throw new BadRequestException("Invalid credentials");

        const isMatch = await compareText({
            plainText: password,
            cypherText: user.password,
        });

        if (!isMatch) throw new UnauthorizedException("Invalid credentials");

        if (!user.isVerified)
            throw new UnauthorizedException("Verify email and try again");

        if (user.status !== UserStatusEnum.Active)
            throw new UnauthorizedException(`Account ${user.status}`);

        const payload: TokenPayload = {
            userId: user._id.toString(),
            role: user.role,
            host,
        };
        const tokens = tokenService.generateToken(payload);

        return tokens;
    }

    async verifyEmail(data: type.VerifyEmailDto) {
        const { email, otp } = data;

        const user = await this.userRepository.findOne({ email });
        if (!user) throw new BadRequestException("Email not found");

        if (user.isVerified)
            throw new UnauthorizedException("Email already verified");

        const hashedOtp = await RedisClient.get(
            RedisKeys.verifyEmail(user._id.toString()),
        );

        if (!hashedOtp) throw new BadRequestException("Invalid or expired otp");

        const isMatch = await compareText({
            plainText: otp,
            cypherText: hashedOtp,
        });

        if (!isMatch) throw new UnauthorizedException("Invalid or expired otp");

        user.isVerified = true;
        user.status = UserStatusEnum.Active;
        await user.save();

        await RedisClient.del(RedisKeys.verifyEmail(user._id.toString()));

        return 1;
    }

    async resendOtp(data: type.ResendOtpDto) {
        const { email } = data;

        const user = await this.userRepository.findOne({ email });

        if (!user) throw new BadRequestException("Unable to process request");

        await generateAndSendOtp(user, "verify-email", "OTP Verification");

        return 1;
    }

    async forgetPassword(data: type.ForgetPasswordDto) {
        const { email } = data;

        const user = await this.userRepository.findOne({ email });

        if (!user) throw new BadRequestException("Invalid request");

        if (!user.isVerified) {
            throw new BadRequestException("Please verify your email first");
        }

        if (user.status !== UserStatusEnum.Active)
            throw new UnauthorizedException(`Account ${user.status}`);

        await generateAndSendOtp(user, "reset-password", "Reset Password");

        return 1;
    }

    async resetPassword(data: type.ResetPasswordDto) {
        const { email, otp, newPassword } = data;

        const user = await this.userRepository.findOne({ email });

        if (!user) throw new BadRequestException("Invalid request");

        const hashedOtp = await RedisClient.get(
            RedisKeys.resetPassword(user._id.toString()),
        );
        if (!hashedOtp) throw new BadRequestException("Invalid or expired otp");

        const isMatch = await compareText({
            plainText: otp,
            cypherText: hashedOtp,
        });
        if (!isMatch) throw new UnauthorizedException("Invalid or expired otp");

        user.password = await hashText({ plainText: newPassword });
        await user.save();

        await RedisClient.del(RedisKeys.resetPassword(user._id.toString()));

        return 1;
    }

    async logout(accessToken: DecodedToken, refreshToken?: string) {
        await RedisClient.createRevokeToken(accessToken, "access");

        if (refreshToken) {
            try {
                const decodedRefresh =
                    tokenService.verifyRefreshToken(refreshToken);
                await RedisClient.createRevokeToken(decodedRefresh, "refresh");
            } catch {}
        }

        return 1;
    }
}

export default new AuthService();
