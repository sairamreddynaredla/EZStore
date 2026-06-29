import jwt from "jsonwebtoken";
import config from "../config/index.js";

export default function jwtAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = auth.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    if (!payload?.id || !payload?.email) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
