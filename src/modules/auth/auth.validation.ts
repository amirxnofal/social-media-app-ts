import { z } from "zod";
import { GenderEnum } from "../../common";

export const registerSchema = z
    .object({
        username: z.string().trim().min(3).max(20),
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
        gender: z.nativeEnum(GenderEnum),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
