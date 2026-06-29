import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import routes from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const createApp = (config) => {
  const app = express();
  const allowedOrigin = config.FRONTEND_URL || "http://localhost:5173";

  app.use(helmet());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(morgan("dev"));

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || origin === allowedOrigin) {
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

  app.use("/uploads", express.static("uploads"));

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;
