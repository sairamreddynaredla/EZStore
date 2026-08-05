import { z } from "zod";

export const authLoginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const authRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long").optional().or(z.literal("")),
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const googleAuthSchema = z.object({
  credential: z.string().trim().optional(),
  idToken: z.string().trim().optional(),
  code: z.string().trim().optional(),
});
