import express from "express";
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

const createApp = () => {
  const app = express();
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

  app.use(helmet());
  app.use(requestContext);
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(inputSanitizer);
  app.use(requestLogger);

  const swaggerDocument = buildOpenApiDocument(config);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
  app.get("/api/docs.json", (_req, res) => res.json(swaggerDocument));

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please slow down.",
      data: null,
      meta: { code: "TOO_MANY_REQUESTS", status: 429 },
    },
  });
  app.use(generalLimiter);

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.replace(/\/$/, "");
      const isAllowedOrigin = configuredOrigins.includes(normalizedOrigin) || normalizedOrigin.endsWith(".vercel.app") || normalizedOrigin.endsWith(".onrender.com") || normalizedOrigin.endsWith(".render.com");

      if (isAllowedOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  };

  app.use(cors(corsOptions));
  app.options(/(.*)/, cors(corsOptions));

  app.get("/health", liveness);
  app.get("/ready", readiness);
  app.use("/uploads", express.static("uploads"));

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;
