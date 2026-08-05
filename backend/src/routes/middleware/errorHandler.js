import logger from "../../utils/logger.js";

export default function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";

  // Log full details server-side only
  logger.error("request_error", {
    requestId: req?.requestId || null,
    status,
    code,
    message: err?.message || "Internal Server Error",
    path: req?.originalUrl || req?.url,
    method: req?.method,
    stack: err?.stack || null,
  });

  // Map known error codes to customer-friendly messages
  let clientMessage = "We're experiencing temporary issues processing your request. Please try again later.";
  if (status >= 400 && status < 500) {
    // For client errors, prefer original message but sanitize
    clientMessage = err?.publicMessage || err?.message || "Invalid request";
  } else if (code === "STRIPE_AUTH_ERROR" || code === "STRIPE_CONFIGURATION_ERROR" || code === "PAYMENT_UNAVAILABLE") {
    clientMessage = "Online card payments are temporarily unavailable. Please try again later.";
  }

  if (process.env.NODE_ENV !== "production" && err?.message) {
    clientMessage = err.message;
  }

  res.status(status).json({
    success: false,
    message: clientMessage,
    data: null,
    meta: {
      code,
      status,
      requestId: req?.requestId || null,
    },
  });
}
