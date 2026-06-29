export default function notFound(_req, res) {
  res.status(404).json({ success: false, message: "Not Found", data: null, meta: { code: "NOT_FOUND", status: 404 } });
}
