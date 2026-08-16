import * as RedisClient from "../../database/redis/redis.service";
import {
    generateOtp,
    hashText,
    IUser,
    otpEmailTemplate,
    REDIS_KEYS,
    sendEmail,
} from "../../common";

export async function generateAndSendOtp(
    user: IUser,
    purpose: "verify-email" | "reset-password",
    subject: string,
) {
    const otp = generateOtp(6);
    const hashedOtp = await hashText({ plainText: otp });

    const keyGenerators = {
        "verify-email": REDIS_KEYS.verifyEmail,
        "reset-password": REDIS_KEYS.resetPassword,
    };

    const key = keyGenerators[purpose](user._id.toString());
    
    await RedisClient.set({
        key,
        value: hashedOtp,
        ttl: 5 * 60,
    });

    await sendEmail({
        to: user.email,
        subject,
        html: otpEmailTemplate(otp),
    });
}
