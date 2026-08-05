import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../database/prismaClient.js";
import config from "../../config/index.js";
import jwtAuth from "../middleware/jwtAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { adminLoginSchema } from "../../validators/admin.js";
import { sendError, sendSuccess } from "../../utils/apiResponse.js";
import crypto from "crypto";
import emailService from "../../services/emailService.js";
import { forgotPasswordLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

const buildUserPayload = (admin) => ({
  id: admin.id,
  name: admin.name || "EZStore Admin",
  email: admin.email,
  role: admin.role,
});

const TOKEN_EXPIRY_MINUTES = 15;

// POST /api/admin/auth/login
router.post("/login", validateRequest(adminLoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, "Email and password are required", { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const admin = await prisma.admin.findFirst({ where: { email: normalizedEmail, deletedAt: null, status: "active" } });

    if (!admin) {
      return sendError(res, "Invalid email or password", { status: 401 });
    }

    const match = await bcrypt.compare(String(password), admin.password);
    if (!match) {
      return sendError(res, "Invalid email or password", { status: 401 });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

    return sendSuccess(res, { token, user: buildUserPayload(admin) }, { message: "Login successful" });
  } catch (err) {
    return next(err);
  }
});

// POST /api/admin/auth/forgot-password
router.post("/forgot-password", forgotPasswordLimiter, async (req, res, next) => {
  try {
    const email = String((req.body && req.body.email) || "").trim().toLowerCase();

    // Always return success to avoid email enumeration
    if (!email) return sendSuccess(res, null, { message: "If that email exists, we'll send reset instructions." });

    const admin = await prisma.admin.findFirst({ where: { email, deletedAt: null, status: "active" } });

    if (!admin) {
      return sendSuccess(res, null, { message: "If that email exists, we'll send reset instructions." });
    }

    // Generate secure token and store its hash
    const token = crypto.randomBytes(48).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    await prisma.admin.update({ where: { id: admin.id }, data: { resetPasswordToken: tokenHash, resetPasswordExpiresAt: expiresAt } });

    const appUrl = config.FRONTEND_URL || config.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
    const resetUrl = `${appUrl.replace(/\/$/, "")}/admin/reset-password?token=${encodeURIComponent(token)}`;

    try {
      await emailService.sendPasswordResetEmail(admin.email, resetUrl);
    } catch (mailErr) {
      // Log but don't expose details
      console.warn(JSON.stringify({ event: "reset_email_failed", message: "Failed to send reset email", error: String(mailErr) }));
    }

    return sendSuccess(res, null, { message: "If that email exists, we'll send reset instructions." });
  } catch (err) {
    return next(err);
  }
});

// POST /api/admin/auth/reset-password
router.post("/reset-password", async (req, res, next) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return sendError(res, "Invalid token or password", { status: 400 });

    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");

    const admin = await prisma.admin.findFirst({ where: { resetPasswordToken: tokenHash } });
    if (!admin) return sendError(res, "Invalid or expired token", { status: 400 });

    if (!admin.resetPasswordExpiresAt || new Date(admin.resetPasswordExpiresAt) < new Date()) {
      return sendError(res, "Invalid or expired token", { status: 400 });
    }

    // Hash new password
    const hashed = await bcrypt.hash(String(password), 12);

    await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed, resetPasswordToken: null, resetPasswordExpiresAt: null } });

    return sendSuccess(res, null, { message: "Password has been reset" });
  } catch (err) {
    return next(err);
  }
});

// POST /api/admin/auth/refresh-token
router.post("/refresh-token", async (req, res, next) => {
  try {
    const refreshToken = req.body?.refreshToken || req.cookies?.refresh_token;
    if (!refreshToken) return sendError(res, "Refresh token missing", { status: 400 });

    let payload;
    try {
      payload = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    } catch (err) {
      return sendError(res, "Invalid refresh token", { status: 401 });
    }

    const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
    if (!admin) return sendError(res, "User not found", { status: 404 });

    const newToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    return sendSuccess(res, { token: newToken }, { message: "Token refreshed" });
  } catch (err) {
    return next(err);
  }
});

// POST /api/admin/auth/logout
router.post("/logout", (_req, res) => sendSuccess(res, null, { message: "Logout successful" }));

// GET /api/admin/auth/me
router.get("/me", jwtAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const admin = await prisma.admin.findUnique({ where: { id: userId } });

    if (!admin) {
      return sendError(res, "User not found", { status: 404 });
    }

    return sendSuccess(res, { user: buildUserPayload(admin) }, { message: "Profile loaded" });
  } catch (err) {
    return next(err);
  }
});

export default router;
