import { z } from 'zod';

export const UserSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(50, "Password is too long"),
});


export type User = z.infer<typeof UserSchema>;