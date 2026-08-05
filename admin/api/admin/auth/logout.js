export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed", data: null });
    return;
  }

  res.status(200).json({ success: true, data: null, message: "Logout successful" });
}
