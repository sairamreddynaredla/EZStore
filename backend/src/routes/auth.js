import express from "express";
import prisma from "../database/prismaClient.js";
import jwtAuth from "../middleware/jwtAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  authLoginSchema,
  authRegisterSchema,
  authForgotPasswordSchema,
  authResetPasswordSchema,
  authChangePasswordSchema,
  authProfileUpdateSchema,
  authVerifyEmailSchema,
  authResendVerificationSchema,
} from "../validators/auth.js";
import {
  normalizeEmail,
  hashPassword,
  comparePassword,
  hashToken,
  generateRandomToken,
  createEmailVerificationToken,
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  buildCustomerPayload,
  setRefreshCookie,
  clearRefreshCookie,
} from "../services/authService.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const router = express.Router();

const attachTokens = async (customer, res) => {
  const accessToken = createAccessToken({ id: customer.id, email: customer.email, role: "customer" });
  const refreshToken = createRefreshToken({ id: customer.id, email: customer.email, role: "customer" });
  const refreshTokenHash = hashToken(refreshToken);
  const refreshTokenExpiresAt = new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRES_MS || 30 * 24 * 60 * 60 * 1000));

  await prisma.customer.update({
    where: { id: customer.id },
    data: { refreshTokenHash, refreshTokenExpiresAt },
  });

  setRefreshCookie(res, refreshToken);
  return accessToken;
};

// POST /api/auth/register
router.post("/register", validateRequest(authRegisterSchema), async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const existingCustomer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
    if (existingCustomer) {
      return sendError(res, "Email is already registered", { status: 409 });
    }

    const { token: verificationToken, tokenHash: verificationTokenHash, tokenSentAt } = createEmailVerificationToken();
    const hashedPassword = await hashPassword(password);
    const customer = await prisma.customer.create({
      data: {
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        fullName: [firstName, lastName].filter(Boolean).join(" ") || null,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone?.trim() || null,
        status: "active",
        emailVerified: false,
        emailVerificationToken: verificationTokenHash,
        emailVerificationTokenSentAt: tokenSentAt,
      },
    });

    // TODO: deliver verificationToken to the customer via email provider
    // Example verification link: `${config.FRONTEND_URL}/verify-email?token=${verificationToken}`
    const token = await attachTokens(customer, res);
    return sendSuccess(res, { token, user: buildCustomerPayload(customer) }, { message: "Registration successful", status: 201 });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/login
router.post("/login", validateRequest(authLoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const customer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
    if (!customer || customer.deletedAt || customer.status !== "active") {
      return sendError(res, "Invalid email or password", { status: 401 });
    }

    const passwordMatch = await comparePassword(password, customer.password);
    if (!passwordMatch) {
      return sendError(res, "Invalid email or password", { status: 401 });
    }

    await prisma.customer.update({ where: { id: customer.id }, data: { lastLoginAt: new Date() } });
    const token = await attachTokens(customer, res);

    return sendSuccess(res, { token, user: buildCustomerPayload(customer) }, { message: "Login successful" });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/logout
router.post("/logout", jwtAuth, async (req, res, next) => {
  try {
    await prisma.customer.update({ where: { id: req.user.id }, data: { refreshTokenHash: null, refreshTokenExpiresAt: null } });
    clearRefreshCookie(res);
    return sendSuccess(res, null, { message: "Logout successful" });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", validateRequest(authForgotPasswordSchema), async (req, res, next) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);
    const customer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
    if (!customer) {
      return sendSuccess(res, null, { message: "If that email exists, password reset instructions have been sent." });
    }

    const resetToken = generateRandomToken();
    const resetTokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        resetPasswordToken: resetTokenHash,
        resetPasswordTokenExpiresAt: expiresAt,
      },
    });

    // TODO: send resetToken to email address using email provider
    return sendSuccess(res, null, { message: "If that email exists, password reset instructions have been sent." });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/resend-verification
router.post("/resend-verification", validateRequest(authResendVerificationSchema), async (req, res, next) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);
    const customer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });

    if (!customer || customer.emailVerified) {
      return sendSuccess(res, null, {
        message: "If that email exists and is not verified, a verification link will be sent.",
      });
    }

    const { token: verificationToken, tokenHash: verificationTokenHash, tokenSentAt } = createEmailVerificationToken();
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        emailVerificationToken: verificationTokenHash,
        emailVerificationTokenSentAt: tokenSentAt,
      },
    });

    // TODO: send verificationToken to email address using email provider
    return sendSuccess(res, null, {
      message: "If that email exists and is not verified, a verification link will be sent.",
    });
  } catch (err) {
    return next(err);
  }
});

// GET /api/auth/verify-email
router.get("/verify-email", validateRequest(authVerifyEmailSchema), async (req, res, next) => {
  try {
    const token = req.query.token;
    const verificationTokenHash = hashToken(token);

    const customer = await prisma.customer.findFirst({
      where: {
        emailVerificationToken: verificationTokenHash,
        emailVerificationTokenSentAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        deletedAt: null,
      },
    });

    if (!customer) {
      return sendError(res, "Verification token is invalid or has expired", { status: 400 });
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        emailVerificationTokenSentAt: null,
      },
    });

    return sendSuccess(res, null, { message: "Email verified successfully" });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", validateRequest(authResetPasswordSchema), async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const resetTokenHash = hashToken(token);
    const customer = await prisma.customer.findFirst({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordTokenExpiresAt: { gte: new Date() },
        deletedAt: null,
      },
    });

    if (!customer) {
      return sendError(res, "Reset password token is invalid or has expired", { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
      },
    });

    clearRefreshCookie(res);
    return sendSuccess(res, null, { message: "Password has been reset successfully" });
  } catch (err) {
    return next(err);
  }
});

// GET /api/auth/refresh-token
router.get("/refresh-token", async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      clearRefreshCookie(res);
      return sendError(res, "Refresh token missing", { status: 401 });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      clearRefreshCookie(res);
      return sendError(res, "Invalid refresh token", { status: 401 });
    }

    const customer = await prisma.customer.findUnique({ where: { id: payload.id } });
    if (!customer || !customer.refreshTokenHash || customer.refreshTokenExpiresAt < new Date()) {
      clearRefreshCookie(res);
      return sendError(res, "Refresh token expired", { status: 401 });
    }

    if (customer.refreshTokenHash !== hashToken(refreshToken)) {
      clearRefreshCookie(res);
      return sendError(res, "Refresh token invalid", { status: 401 });
    }

    const token = await attachTokens(customer, res);
    return sendSuccess(res, { token, user: buildCustomerPayload(customer) }, { message: "Token refreshed" });
  } catch (err) {
    return next(err);
  }
});

// GET /api/auth/me
router.get("/me", jwtAuth, async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { id: req.user.id } });
    if (!customer) {
      return sendError(res, "User not found", { status: 404 });
    }
    return sendSuccess(res, { user: buildCustomerPayload(customer) }, { message: "Profile loaded" });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/auth/profile
router.put("/profile", jwtAuth, validateRequest(authProfileUpdateSchema), async (req, res, next) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.user.id },
      data: {
        firstName: req.body.firstName?.trim() || null,
        lastName: req.body.lastName?.trim() || null,
        fullName: [req.body.firstName, req.body.lastName].filter(Boolean).join(" ") || null,
        phone: req.body.phone?.trim() || null,
        profileImage: req.body.profileImage || null,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null,
        gender: req.body.gender || null,
      },
    });

    return sendSuccess(res, { user: buildCustomerPayload(customer) }, { message: "Profile updated" });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/auth/change-password
router.put("/change-password", jwtAuth, validateRequest(authChangePasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const customer = await prisma.customer.findUnique({ where: { id: req.user.id } });
    if (!customer) {
      return sendError(res, "User not found", { status: 404 });
    }

    const validPassword = await comparePassword(currentPassword, customer.password);
    if (!validPassword) {
      return sendError(res, "Current password is incorrect", { status: 401 });
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.customer.update({ where: { id: req.user.id }, data: { password: hashedPassword } });
    clearRefreshCookie(res);
    return sendSuccess(res, null, { message: "Password updated successfully" });
  } catch (err) {
    return next(err);
  }
});

export default router;
