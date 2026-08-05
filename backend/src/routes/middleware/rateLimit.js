import rateLimit from "express-rate-limit";

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { success: false, message: "Too many password reset requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export default { forgotPasswordLimiter };
