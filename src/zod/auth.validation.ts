import z, { email } from "zod";

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

const verifyEmailWithOtpSchema = z.object({
       email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
        otp: z.string().length(6, "OTP must be 6 digits")
});

const resendOTPSchema=z.object({
         email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
        type:z.string()
})

const verifyEmailSchema=z.object({
         email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required")
});
const resetPasswordSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
    password: z
        .string()
        .min(8, "Minimum length will be 8 characters")
        .max(20, "Maximum length can be 20 characters")
        .nonempty("Password is required"),
        otp: z.string().length(6, "OTP must be 6 digits")
});
const changePasswordSchema=z.object({
    newPassword: z
    .string("newPassword is required")
    .min(8, "Minimum lenth will be 8 characters")
    .max(20, "Maximum length can be 20 characters"),
    currentPassword: z
    .string("currentPassword is required")
    .min(8, "Minimum lenth will be 8 characters")
    .max(20, "Maximum length can be 20 characters"),

})

export const authValidationSchema = {changePasswordSchema,resetPasswordSchema,loginSchema ,registerSchema,verifyEmailWithOtpSchema,resendOTPSchema,verifyEmailSchema};