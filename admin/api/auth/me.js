export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ success: false, message: "Method not allowed", data: null });
    return;
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized", data: null });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user: { id: 1, name: "EZStore Admin", email: "admin@ezstore.com", role: "admin" },
    },
    message: "Profile loaded",
  });
}
