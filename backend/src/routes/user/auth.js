import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../database/prismaClient.js";
import config from "../../config/index.js";
import jwtAuth from "../middleware/jwtAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authLoginSchema, authRegisterSchema } from "../../validators/auth.js";
import { sendError, sendSuccess } from "../../utils/apiResponse.js";

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
  status: customer.status,
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
});

const normalizeEmail = (email) => String(email).trim().toLowerCase();

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

export default router;
