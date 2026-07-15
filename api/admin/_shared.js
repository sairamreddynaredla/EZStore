import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ezstore.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "ezstore-admin-demo-secret";
const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ezstore-pets.vercel.app");
const ALLOWED_ORIGINS = [
  FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
]
  .filter(Boolean)
  .map((value) => value.trim().replace(/\/$/, ""));

const toBase64Url = (value) => Buffer.from(value).toString("base64url");
const fromBase64Url = (value) => Buffer.from(value, "base64url").toString("utf8");

export const signToken = (payload) => {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = toBase64Url(JSON.stringify(payload));
  const signature = createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
};

export const verifyToken = (token) => {
  const segments = token.split(".");
  if (segments.length !== 3) {
    throw new Error("Invalid token");
  }

  const [header, body, signature] = segments;
  const expectedSignature = createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new Error("Invalid token");
  }

  return JSON.parse(fromBase64Url(body));
};

export const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

export const sendSuccess = (res, data, message = "Success") => {
  sendJson(res, 200, { success: true, data, message });
};

export const sendError = (res, message, statusCode = 400) => {
  sendJson(res, statusCode, { success: false, message, data: null });
};

export const readJsonBody = async (req) => {
  if (req.body !== undefined) {
    if (req.body === null) return {};
    if (typeof req.body === "object") return req.body;
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
  }

  if (typeof req.read === "function") {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const rawBody = Buffer.concat(chunks).toString("utf8");
    if (!rawBody) return {};

    try {
      return JSON.parse(rawBody);
    } catch {
      return {};
    }
  }

  return {};
};

export const setCorsHeaders = (req, res) => {
  const requestOrigin = req.headers?.origin;

  if (requestOrigin) {
    try {
      const originUrl = new URL(requestOrigin);
      const normalizedOrigin = originUrl.origin;
      const host = originUrl.hostname;
      const requestHost = req.headers.host ? req.headers.host.split(":")[0] : "";

      if (ALLOWED_ORIGINS.includes(normalizedOrigin) || (requestHost && host === requestHost) || host.endsWith(".vercel.app") || host.endsWith(".vercel.dev") || host.endsWith(".now.sh")) {
        res.setHeader("Access-Control-Allow-Origin", normalizedOrigin);
        res.setHeader("Vary", "Origin");
      } else if (FRONTEND_URL) {
        res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
      }
    } catch {
      if (FRONTEND_URL) {
        res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
      }
    }
  } else if (FRONTEND_URL) {
    res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
};

export const getAdminCredentials = () => ({
  email: DEFAULT_ADMIN_EMAIL,
  password: DEFAULT_ADMIN_PASSWORD,
});
