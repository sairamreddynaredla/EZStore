import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
  .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
  .regex(/(?=.*\d)/, "Password must contain at least one number")
  .regex(/(?=.*[!@#$%^&*])/, "Password must contain at least one special character");

export const authLoginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const authRegisterSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters long").optional().or(z.literal("")),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters long").optional().or(z.literal("")),
  email: z.string().trim().email("Please provide a valid email address"),
  password: passwordSchema,
  phone: z.string().trim().optional().or(z.literal("")),
});

export const authForgotPasswordSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
});

export const authResetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Reset token is required"),
  password: passwordSchema,
});

export const authChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: passwordSchema,
});

export const authProfileUpdateSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters long").optional().or(z.literal("")),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters long").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  profileImage: z.string().trim().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.string().trim().optional().or(z.literal("")),
});

export const authResendVerificationSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
});

export const authVerifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Verification token is required"),
});
