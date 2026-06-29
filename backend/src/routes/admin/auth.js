import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../database/prismaClient.js";
import config from "../../config/index.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { adminLoginSchema } from "../../validators/admin.js";
import { sendError, sendSuccess } from "../../utils/apiResponse.js";

const router = express.Router();

const buildUserPayload = (admin) => ({
  id: admin.id,
  name: admin.name || "EZStore Admin",
  email: admin.email,
  role: admin.role,
});

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
