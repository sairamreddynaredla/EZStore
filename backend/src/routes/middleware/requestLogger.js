import logger from "../../utils/logger.js";

export default function requestLogger(req, _res, next) {
  logger.info("incoming_request", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  next();
}
