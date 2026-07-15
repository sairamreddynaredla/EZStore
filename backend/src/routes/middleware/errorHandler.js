import logger from "../../utils/logger.js";

export default function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  logger.error("request_error", {
    requestId: req?.requestId || null,
    status,
    message,
    path: req?.originalUrl || req?.url,
    method: req?.method,
    stack: err.stack,
  });

  res.status(status).json({
    success: false,
    message,
    data: null,
    meta: {
      code: err.code || "INTERNAL_ERROR",
      status,
      requestId: req?.requestId || null,
    },
  });
}
