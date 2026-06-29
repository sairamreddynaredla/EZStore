import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const hashPassword = async (password) => bcrypt.hash(String(password), 10);
const comparePassword = async (password, hash) => bcrypt.compare(String(password), hash);

const hashToken = (token) => crypto.createHash("sha256").update(String(token)).digest("hex");
const generateRandomToken = () => crypto.randomBytes(32).toString("hex");

const EMAIL_VERIFICATION_TOKEN_EXPIRES_MS = 24 * 60 * 60 * 1000;
const createEmailVerificationToken = () => {
  const token = generateRandomToken();
  return {
    token,
    tokenHash: hashToken(token),
    tokenSentAt: new Date(),
  };
};

const createAccessToken = (payload) =>
  jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

const createRefreshToken = (payload) =>
  jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRES_IN });

const verifyAccessToken = (token) => jwt.verify(token, config.JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, config.JWT_REFRESH_SECRET);

const buildCustomerPayload = (customer) => ({
  id: customer.id,
  firstName: customer.firstName || null,
  lastName: customer.lastName || null,
  fullName:
    customer.fullName ||
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    customer.name ||
    "EZStore Customer",
  email: customer.email,
  phone: customer.phone || null,
  profileImage: customer.profileImage || null,
  dateOfBirth: customer.dateOfBirth || null,
  gender: customer.gender || null,
  status: customer.status,
  emailVerified: Boolean(customer.emailVerified),
  lastLogin: customer.lastLoginAt || null,
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
});

const setRefreshCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    maxAge: config.JWT_REFRESH_EXPIRES_MS,
    path: "/api/auth",
  };
  res.cookie("refresh_token", token, cookieOptions);
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refresh_token", {
    path: "/api/auth",
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });
};

export {
  normalizeEmail,
  hashPassword,
  comparePassword,
  hashToken,
  generateRandomToken,
  createEmailVerificationToken,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  buildCustomerPayload,
  setRefreshCookie,
  clearRefreshCookie,
};
