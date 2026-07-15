import { sendError, sendSuccess, setCorsHeaders, verifyToken } from "../_shared.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    sendError(res, "Method not allowed", 405);
    return;
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  try {
    const payload = verifyToken(token);
    sendSuccess(res, { user: { id: payload.id || 1, name: "EZStore Admin", email: payload.email || "admin@ezstore.com", role: payload.role || "admin" } }, "Profile loaded");
  } catch {
    sendError(res, "Unauthorized", 401);
  }
}
