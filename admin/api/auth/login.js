export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed", data: null });
    return;
  }

  const body = typeof req.body === "object" ? req.body : {};
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (email === "admin@ezstore.com" && password === "admin123") {
    res.status(200).json({
      success: true,
      data: {
        token: "demo-admin-token",
        user: { id: 1, name: "EZStore Admin", email, role: "admin" },
      },
      message: "Login successful",
    });
    return;
  }

  res.status(401).json({ success: false, message: "Invalid email or password", data: null });
}
