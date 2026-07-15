import { readJsonBody, sendError, sendSuccess, setCorsHeaders, signToken, getAdminCredentials } from "../_shared.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    sendError(res, "Method not allowed", 405);
    return;
  }

  const body = await readJsonBody(req);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const { email: expectedEmail, password: expectedPassword } = getAdminCredentials();

  if (email === expectedEmail.toLowerCase() && password === expectedPassword) {
    const token = signToken({ id: 1, email, role: "admin", sub: 1 });
    sendSuccess(res, { token, user: { id: 1, name: "EZStore Admin", email, role: "admin" } }, "Login successful");
    return;
  }

  sendError(res, "Invalid email or password", 401);
}
