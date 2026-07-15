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

const signToken = (payload) => {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = toBase64Url(JSON.stringify(payload));
  const signature = createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
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

const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

const sendSuccess = (res, data, message = "Success") => {
  sendJson(res, 200, { success: true, data, message });
};

const sendError = (res, message, statusCode = 400) => {
  sendJson(res, statusCode, { success: false, message, data: null });
};

const getRequestPath = (req) => {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  return url.pathname.replace(/^\/api/, "") || "/";
};

const readJsonBody = async (req) => {
  if (req.body !== undefined) {
    if (req.body === null) {
      return {};
    }

    if (typeof req.body === "object") {
      return req.body;
    }

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
    if (!rawBody) {
      return {};
    }

    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  }

  return {};
};

const getAllowedOrigin = (req) => {
  const requestOrigin = req.headers.origin;
  if (!requestOrigin) {
    return null;
  }

  try {
    const originUrl = new URL(requestOrigin);
    const normalizedOrigin = originUrl.origin;
    const host = originUrl.hostname;
    const requestHost = req.headers.host ? req.headers.host.split(":")[0] : "";

    if (ALLOWED_ORIGINS.includes(normalizedOrigin)) {
      return normalizedOrigin;
    }

    if (requestHost && host === requestHost) {
      return normalizedOrigin;
    }

    if (host.endsWith(".vercel.app") || host.endsWith(".vercel.dev") || host.endsWith(".now.sh")) {
      return normalizedOrigin;
    }

    if (process.env.VERCEL_URL && host === process.env.VERCEL_URL) {
      return normalizedOrigin;
    }

    if (process.env.VERCEL_BRANCH_URL && host === process.env.VERCEL_BRANCH_URL) {
      return normalizedOrigin;
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL && host === process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return normalizedOrigin;
    }
  } catch {
    // Ignore invalid origins and fall back to the configured frontend URL.
  }

  return null;
};

export default async function handler(req, res) {
  const allowedOrigin = getAllowedOrigin(req);
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
  } else if (FRONTEND_URL) {
    res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const path = getRequestPath(req);
  const method = req.method.toUpperCase();
  console.log("[api-index]", JSON.stringify({ method, path, host: req.headers.host, body: req.body }));

  try {
  if (path === "/health") {
    sendSuccess(res, { status: "ok" });
    return;
  }

  if (path === "/admin/auth/login" && method === "POST") {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (email === DEFAULT_ADMIN_EMAIL.toLowerCase() && password === DEFAULT_ADMIN_PASSWORD) {
      const token = signToken({ id: 1, email, role: "admin", sub: 1 });
      sendSuccess(res, { token, user: { id: 1, name: "EZStore Admin", email, role: "admin" } }, "Login successful");
      return;
    }

    sendError(res, "Invalid email or password", 401);
    return;
  }

  if (path === "/admin/auth/logout") {
    sendSuccess(res, null, "Logout successful");
    return;
  }

  if (path === "/admin/auth/me" && method === "GET") {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    try {
      const payload = verifyToken(token);
      sendSuccess(res, { user: { id: payload.id || 1, name: "EZStore Admin", email: payload.email || DEFAULT_ADMIN_EMAIL, role: payload.role || "admin" } }, "Profile loaded");
    } catch {
      sendError(res, "Unauthorized", 401);
    }
    return;
  }

  if (path.startsWith("/admin/")) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    try {
      verifyToken(token);
    } catch {
      sendError(res, "Unauthorized", 401);
      return;
    }
  }

  if (path === "/admin/dashboard/summary") {
    sendSuccess(res, { totalOrders: 0, totalRevenue: 0, totalCustomers: 0, pendingOrders: 0, lowStockProducts: 0, recentOrders: [] });
    return;
  }

  if (path === "/admin/products") {
    sendSuccess(res, { items: [], total: 0, page: 1, pages: 1 });
    return;
  }

  if (path === "/admin/categories") {
    sendSuccess(res, { items: [], total: 0, page: 1, pages: 1 });
    return;
  }

  if (path === "/admin/orders") {
    sendSuccess(res, { items: [], total: 0, page: 1, pages: 1 });
    return;
  }

  if (path === "/admin/customers") {
    sendSuccess(res, { items: [], total: 0, page: 1, pages: 1 });
    return;
  }

  if (path === "/admin/coupons") {
    sendSuccess(res, { items: [], total: 0, page: 1, pages: 1 });
    return;
  }

  if (path === "/admin/reviews") {
    sendSuccess(res, { items: [], total: 0, page: 1, pages: 1 });
    return;
  }

  if (path === "/admin/settings") {
    sendSuccess(res, { general: {}, payment: {}, shipping: {}, notifications: {} });
    return;
  }

  if (path === "/admin/admins") {
    sendSuccess(res, { items: [{ id: 1, name: "EZStore Admin", email: DEFAULT_ADMIN_EMAIL, role: "admin" }], total: 1, page: 1, pages: 1 });
    return;
  }

  sendError(res, "Not found", 404);
  } catch (error) {
    console.error("[api-index] handler error", error);
    sendError(res, "Internal server error", 500);
  }
}
