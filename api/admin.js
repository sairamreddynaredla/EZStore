import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ezstore.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "ezstore-admin-demo-secret";
const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ezstore-pets.vercel.app");

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

const readJsonBody = async (req) => {
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
    return rawBody ? JSON.parse(rawBody) : {};
  }

  return {};
};

export default async function handler(req, res) {
  const requestOrigin = req.headers?.origin;
  if (requestOrigin) {
    try {
      const originUrl = new URL(requestOrigin);
      const normalizedOrigin = originUrl.origin;
      res.setHeader("Access-Control-Allow-Origin", normalizedOrigin);
      res.setHeader("Vary", "Origin");
    } catch {
      res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
    }
  } else {
    res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const pathname = req.url ? new URL(req.url, `https://${req.headers.host || "localhost"}`).pathname : "/";

  if (req.method === "POST" && pathname.includes("/auth/login")) {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (email === DEFAULT_ADMIN_EMAIL.toLowerCase() && password === DEFAULT_ADMIN_PASSWORD) {
      const token = signToken({ id: 1, email, role: "admin", sub: 1 });
      return sendSuccess(res, { token, user: { id: 1, name: "EZStore Admin", email, role: "admin" } }, "Login successful");
    }

    return sendError(res, "Invalid email or password", 401);
  }

  if (req.method === "POST" && pathname.includes("/auth/logout")) {
    return sendSuccess(res, null, "Logout successful");
  }

  if (req.method === "GET" && pathname.includes("/auth/me")) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) return sendError(res, "Unauthorized", 401);

    try {
      const payload = verifyToken(token);
      return sendSuccess(res, { user: { id: payload.id || 1, name: "EZStore Admin", email: payload.email || DEFAULT_ADMIN_EMAIL, role: payload.role || "admin" } }, "Profile loaded");
    } catch {
      return sendError(res, "Unauthorized", 401);
    }
  }

  return sendError(res, "Not found", 404);
}
