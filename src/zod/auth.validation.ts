import z from "zod";

const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
    password: z
        .string()
        .min(8, "Minimum length will be 8 characters")
        .max(20, "Maximum length can be 20 characters")
        .nonempty("Password is required"),
});
const registerSchema = z.object({
    name: z
    .string()
    .nonempty("Name is required"),
    email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
    password: z
        .string()
        .min(8, "Minimum length will be 8 characters")
        .max(20, "Maximum length can be 20 characters")
        .nonempty("Password is required"),
});
export const authValidationSchema = {loginSchema ,registerSchema};