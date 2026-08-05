const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
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
    if (!rawBody) return {};
    try {
      return JSON.parse(rawBody);
    } catch {
      return {};
    }
  }

  return {};
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { success: false, message: "Method not allowed", data: null });
  }

  const body = await readJsonBody(req);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (email === "admin@ezstore.com" && password === "admin123") {
    return sendJson(res, 200, {
      success: true,
      data: {
        token: "demo-admin-token",
        user: { id: 1, name: "EZStore Admin", email, role: "admin" },
      },
      message: "Login successful",
    });
  }

  return sendJson(res, 401, { success: false, message: "Invalid email or password", data: null });
}
