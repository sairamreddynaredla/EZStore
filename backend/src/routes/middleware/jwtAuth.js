import jwt from "jsonwebtoken";
import config from "../../config/index.js";

const getBearerToken = (req) => {
  const auth = req.headers.authorization;
  return auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : null;
};

export default function jwtAuth(req, res, next) {
  const token = getBearerToken(req);
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

// Allows guest checkout while attaching a verified customer to orders made by
// signed-in users. An invalid token is still rejected rather than treated as a guest.
export function optionalJwtAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) return next();

  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    if (!payload?.id || !payload?.email) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
