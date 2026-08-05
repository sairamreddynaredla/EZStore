import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../../database/prismaClient.js";
import config from "../../config/index.js";
import jwtAuth from "../middleware/jwtAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { forgotPasswordLimiter } from "../middleware/rateLimit.js";
import {
  authLoginSchema,
  authRegisterSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
} from "../../validators/auth.js";
import { sendError, sendSuccess } from "../../utils/apiResponse.js";
import emailService from "../../services/emailService.js";
import { buildGoogleAuthUrl, exchangeGoogleCode } from "../../services/shared/googleAuth.js";

const router = express.Router();

const buildUserPayload = (customer) => ({
  id: customer.id,
  name:
    customer.fullName ||
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    "EZStore Customer",
  email: customer.email,
  firstName: customer.firstName || null,
  lastName: customer.lastName || null,
  fullName: customer.fullName || null,
  phone: customer.phone || null,
  avatar: customer.profileImage || null,
  profileImage: customer.profileImage || null,
  status: customer.status,
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
});

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

// POST /api/auth/register
router.post("/register", validateRequest(authRegisterSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const existingCustomer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
    if (existingCustomer) {
      return sendError(res, "Customer already exists", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const customer = await prisma.customer.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        fullName: name ? String(name).trim() : null,
        status: "active",
      },
    });

    const token = jwt.sign({ id: customer.id, email: customer.email }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    return sendSuccess(res, { token, user: buildUserPayload(customer) }, { message: "Registration successful", status: 201 });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/login
router.post("/login", validateRequest(authLoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const customer = await prisma.customer.findFirst({
      where: { email: normalizedEmail, deletedAt: null, status: "active" },
    });

    if (!customer) {
      return sendError(res, "Invalid email or password", { status: 401 });
    }

    const isMatch = await bcrypt.compare(String(password), customer.password);
    if (!isMatch) {
      return sendError(res, "Invalid email or password", { status: 401 });
    }

    const token = jwt.sign({ id: customer.id, email: customer.email }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    await prisma.customer.update({ where: { id: customer.id }, data: { lastLoginAt: new Date() } });

    return sendSuccess(res, { token, user: buildUserPayload(customer) }, { message: "Login successful" });
  } catch (err) {
    return next(err);
  }
});

// GET /api/auth/google/url - Get Google OAuth URL
router.get("/google/url", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.trim() : null;
  const backendUrl = config.BACKEND_URL.replace(/\/$/, "");
  const redirectUri = `${backendUrl}/api/auth/google/callback`;
  const state = crypto.randomBytes(16).toString("hex");

  if (!clientId) {
    // Development demo mode fallback if Google OAuth credentials are not set in .env
    const demoUrl = `${backendUrl}/api/auth/google/callback?demo=true`;
    return sendSuccess(res, { url: demoUrl, isDemo: true }, { message: "Demo Google Auth URL generated" });
  }

  const url = buildGoogleAuthUrl({ clientId, redirectUri, state });
  return sendSuccess(res, { url, isDemo: false }, { message: "Google Auth URL generated" });
});

// GET /api/auth/google/callback - Google OAuth callback
router.get("/google/callback", async (req, res) => {
  const frontendUrl = config.FRONTEND_URL || "http://localhost:5173";
  try {
    const { code, demo, error: googleError } = req.query;

    let googleEmail, avatar, name;

    if (demo === "true" || (!process.env.GOOGLE_CLIENT_ID && !code)) {
      // Demo user when GOOGLE_CLIENT_ID is not configured in development
      googleEmail = "google.user@ezstore.com";
      avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
      name = "Google User";
    } else {
      if (googleError || !code) {
        return res.redirect(`${frontendUrl.replace(/\/$/, "")}/auth/google/callback?error=cancelled`);
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = `${config.BACKEND_URL.replace(/\/$/, "")}/api/auth/google/callback`;

      const googleUser = await exchangeGoogleCode({
        code: String(code),
        clientId,
        clientSecret,
        redirectUri,
      });

      googleEmail = normalizeEmail(googleUser.email);
      avatar = googleUser.picture || null;
      name = googleUser.name || googleUser.given_name || "EZStore Customer";
    }

    let customer = await prisma.customer.findFirst({
      where: { email: googleEmail, deletedAt: null },
    });

    if (!customer) {
      const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
      customer = await prisma.customer.create({
        data: {
          email: googleEmail,
          password: randomPassword,
          fullName: name,
          profileImage: avatar,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          status: "active",
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          profileImage: avatar || customer.profileImage,
          lastLoginAt: new Date(),
        },
      });
    }

    const token = jwt.sign({ id: customer.id, email: customer.email }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    return res.redirect(`${frontendUrl.replace(/\/$/, "")}/auth/google/callback?token=${token}`);
  } catch (err) {
    console.error("Google auth callback error:", err);
    return res.redirect(`${frontendUrl.replace(/\/$/, "")}/auth/google/callback?error=auth_failed`);
  }
});

// POST /api/auth/google - Direct ID Token or Code verify from frontend
router.post("/google", validateRequest(googleAuthSchema), async (req, res, next) => {
  try {
    const { credential, idToken, code } = req.body;
    const tokenToVerify = credential || idToken;

    let googleUser = null;

    if (tokenToVerify) {
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenToVerify)}`);
      if (!googleRes.ok) {
        return sendError(res, "Invalid or expired Google ID token", { status: 401 });
      }
      googleUser = await googleRes.json();
    } else if (code) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = `${config.BACKEND_URL.replace(/\/$/, "")}/api/auth/google/callback`;

      googleUser = await exchangeGoogleCode({
        code: String(code),
        clientId,
        clientSecret,
        redirectUri,
      });
    } else {
      return sendError(res, "Google credential or authorization code is required", { status: 400 });
    }

    const googleEmail = normalizeEmail(googleUser.email);
    const avatar = googleUser.picture || null;
    const name = googleUser.name || googleUser.given_name || "EZStore Customer";

    if (!googleEmail) {
      return sendError(res, "Unable to extract email from Google account", { status: 400 });
    }

    let customer = await prisma.customer.findFirst({
      where: { email: googleEmail, deletedAt: null },
    });

    if (!customer) {
      const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
      customer = await prisma.customer.create({
        data: {
          email: googleEmail,
          password: randomPassword,
          fullName: name,
          profileImage: avatar,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          status: "active",
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          profileImage: avatar || customer.profileImage,
          lastLoginAt: new Date(),
        },
      });
    }

    const token = jwt.sign({ id: customer.id, email: customer.email }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    return sendSuccess(res, { token, user: buildUserPayload(customer) }, { message: "Google sign-in successful" });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPasswordLimiter, validateRequest(forgotPasswordSchema), async (req, res, next) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);
    const successMsg = "If that email exists, password reset instructions were sent.";

    const customer = await prisma.customer.findFirst({
      where: { email: normalizedEmail, deletedAt: null, status: "active" },
    });

    if (!customer) {
      return sendSuccess(res, null, { message: successMsg });
    }

    const rawToken = crypto.randomBytes(48).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        resetPasswordToken: tokenHash,
        resetPasswordTokenExpiresAt: expiresAt,
      },
    });

    const frontendUrl = config.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(rawToken)}`;

    try {
      await emailService.sendPasswordResetEmail(customer.email, resetUrl);
    } catch (mailErr) {
      console.warn(JSON.stringify({ event: "customer_reset_email_failed", error: String(mailErr) }));
    }

    return sendSuccess(res, null, { message: successMsg });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", validateRequest(resetPasswordSchema), async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const tokenHash = crypto.createHash("sha256").update(String(token).trim()).digest("hex");

    const customer = await prisma.customer.findFirst({
      where: { resetPasswordToken: tokenHash, deletedAt: null },
    });

    if (!customer) {
      return sendError(res, "Invalid or expired reset token", { status: 400 });
    }

    if (!customer.resetPasswordTokenExpiresAt || new Date(customer.resetPasswordTokenExpiresAt) < new Date()) {
      return sendError(res, "Reset token has expired. Please request a new one.", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
      },
    });

    return sendSuccess(res, null, { message: "Password has been reset successfully. Please log in with your new password." });
  } catch (err) {
    return next(err);
  }
});

// GET /api/auth/me
router.get("/me", jwtAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const customer = await prisma.customer.findFirst({ where: { id: userId, deletedAt: null } });

    if (!customer) {
      return sendError(res, "User not found", { status: 404 });
    }

    return sendSuccess(res, { user: buildUserPayload(customer) }, { message: "Profile loaded" });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/auth/profile - update current user's profile
const profileUpdateSchema = z.object({
  firstName: z.string().trim().max(100).optional().or(z.literal("")),
  lastName: z.string().trim().max(100).optional().or(z.literal("")),
  fullName: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
});

router.put("/profile", jwtAuth, validateRequest(profileUpdateSchema), async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const updates = {};

    if (Object.prototype.hasOwnProperty.call(req.body, "firstName")) updates.firstName = req.body.firstName || null;
    if (Object.prototype.hasOwnProperty.call(req.body, "lastName")) updates.lastName = req.body.lastName || null;
    if (Object.prototype.hasOwnProperty.call(req.body, "fullName")) updates.fullName = req.body.fullName || null;
    if (Object.prototype.hasOwnProperty.call(req.body, "phone")) updates.phone = req.body.phone || null;

    if (Object.keys(updates).length === 0) {
      return sendError(res, "No profile fields supplied", { status: 400 });
    }

    const updated = await prisma.customer.update({ where: { id: userId }, data: updates });
    return sendSuccess(res, { user: buildUserPayload(updated) }, { message: "Profile updated" });
  } catch (err) {
    return next(err);
  }
});

export default router;
