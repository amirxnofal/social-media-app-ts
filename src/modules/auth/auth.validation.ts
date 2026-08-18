import { z } from "zod";
import { GenderEnum } from "../../common";

// Register
export const registerSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3)
            .max(20)
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores",
            ),
        firstName: z
            .string()
            .trim()
            .min(3, "First Name must be at least 3 characters")
            .max(50),
        lastName: z
            .string()
            .trim()
            .min(3, "Last Name must be at least 3 characters")
            .max(50)
            .optional(),
        email: z.string().trim().toLowerCase().email("Invalid email format"),
        phone: z.string().regex(/^01[0125][0-9]{8}$/, "Invalid phone number"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
        gender: z.nativeEnum(GenderEnum).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterDto = z.infer<typeof registerSchema>;

// Login
export const loginSchema = z.object({
    identifier: z.string().trim().min(3).max(30),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginDto = z.infer<typeof loginSchema>;

// Verify email
export const verifyEmailSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    otp: z.string().length(6).trim(),
});

export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;

// Resend OTP
export const resendOtpSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
});

export type ResendOtpDto = z.infer<typeof resendOtpSchema>;

// Forget password
export const forgetPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
});

export type ForgetPasswordDto = z.infer<typeof forgetPasswordSchema>;


// Reset Password
export const resetPasswordSchema = z
    .object({
        email: z.string().trim().toLowerCase().email("Invalid email format"),
        otp: z.string().length(6, "OTP must be 6 digits"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    });

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;