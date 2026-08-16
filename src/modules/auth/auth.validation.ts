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

export type loginDto = z.infer<typeof loginSchema>;

// Verify email
export const verifyEmailSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    otp: z.string().length(6).trim(),
});

export type verifyEmailDto = z.infer<typeof verifyEmailSchema>;
