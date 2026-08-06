import express from "express";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import routes from "./routes/index.js";
import notFound from "./routes/middleware/notFound.js";
import errorHandler from "./routes/middleware/errorHandler.js";
import requestContext from "./routes/middleware/requestContext.js";
import requestLogger from "./routes/middleware/requestLogger.js";
import inputSanitizer from "./routes/middleware/inputSanitizer.js";
import { liveness, readiness } from "./routes/middleware/healthChecks.js";
import rateLimit from "express-rate-limit";
import config from "./config/index.js";
import buildOpenApiDocument from "./swaggerDoc.js";
import validateEnv from "./utils/envValidator.js";

const createApp = () => {
  const app = express();

  // Stripe configuration is mandatory; validation throws before the server starts.
  validateEnv();
  // Respect the reverse proxy in production so rate limiting uses the real
  // client address rather than the proxy address.
  if (config.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  const configuredOrigins = [
    config.FRONTEND_URL,
    "https://ezstore-admin.vercel.app",
    "https://ezstore.vercel.app",
    "https://ezstore-pets.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...(config.ALLOWED_ORIGINS || []),
  ]
    .filter(Boolean)
    .map((value) => value.replace(/\/$/, ""));

  const allowLocalDevOrigins = configuredOrigins.some((value) => value.includes("localhost") || value.includes("127.0.0.1"));
  const isLocalhostOrigin = (origin) => {
    try {
      const originUrl = new URL(origin);
      return originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1";
    } catch {
      return false;
    }
  };

  app.use(helmet());
  app.use(requestContext);
  app.use(json({ verify: (req, _res, buf) => { req.rawBody = buf.toString(); } }));
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(inputSanitizer);
  app.use(requestLogger);

  // Serve uploaded static files before rate limiting so local dev and proxies
  // can fetch images without being affected by API request throttling.
  // If a requested upload file is missing, return a tiny SVG placeholder
  // instead of 404 so admin UI shows a visible fallback image without
  // relying on external hosts.
  app.use("/uploads", (req, res, next) => {
    try {
      const uploadsRoot = path.resolve(process.cwd(), "uploads");
      const filePath = path.join(uploadsRoot, decodeURIComponent(req.path || "").replace(/^\//, ""));
      if (!fs.existsSync(filePath)) {
        res.setHeader("Content-Type", "image/svg+xml");
        res.status(200).send(
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" ry="3"/><path d="M8 14s1.5-2 4-2 4 2 4 2"/><circle cx="12" cy="10" r="2"/></svg>'
        );
        return;
      }
    } catch (err) {
      // If any error occurs while checking, fall through to static handler
      // which will return 404 as usual.
    }
    next();
  });
  app.use("/uploads", express.static("uploads"));

  const swaggerDocument = buildOpenApiDocument(config);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
  app.get("/api/docs.json", (_req, res) => res.json(swaggerDocument));

  const rateLimitWindowMs = Number(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
  const rateLimitMax = Number(process.env.API_RATE_LIMIT_MAX) || 1200;
  const shouldRateLimit = config.NODE_ENV === "production" || Boolean(process.env.API_RATE_LIMIT_IN_DEVELOPMENT);

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.replace(/\/$/, "");
      const isAllowedOrigin = configuredOrigins.includes(normalizedOrigin)
        || (allowLocalDevOrigins && isLocalhostOrigin(normalizedOrigin))
        || normalizedOrigin.endsWith(".vercel.app")
        || normalizedOrigin.endsWith(".onrender.com")
        || normalizedOrigin.endsWith(".render.com");

      if (isAllowedOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Idempotency-Key"],
  };

  app.use(cors(corsOptions));
  app.options(/(.*)/, cors(corsOptions));

  const generalLimiter = rateLimit({
    windowMs: rateLimitWindowMs,
    max: rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please slow down.",
      data: null,
      meta: { code: "TOO_MANY_REQUESTS", status: 429 },
    },
  });
  // Local development can mount components more than once under React Strict
  // Mode, which should not exhaust a production-oriented shared IP limit.
  // Keep the limiter enabled in production, or locally when explicitly asked.
  if (shouldRateLimit) {
    app.use(generalLimiter);
  }

  app.get("/health", liveness);
  app.get("/ready", readiness);
  

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;
