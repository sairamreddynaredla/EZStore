import dotenv from "dotenv";
import fs from "fs";

const envFile = `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ""}`;

dotenv.config();
if (process.env.NODE_ENV && fs.existsSync(envFile)) {
  dotenv.config({ path: envFile, override: true });
}

const parseAllowedOrigins = () => {
  const raw = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => value.replace(/\/$/, ""));
};

const requiredEnvs = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET", "FRONTEND_URL"];
if (process.env.NODE_ENV === "production") {
  requiredEnvs.push("BACKEND_URL");
}

const missingEnvs = requiredEnvs.filter((name) => !process.env[name]);
if (missingEnvs.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvs.join(", ")}`);
}

const config = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  JWT_REFRESH_EXPIRES_MS: Number(process.env.JWT_REFRESH_EXPIRES_MS) || 30 * 24 * 60 * 60 * 1000,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
  ALLOWED_ORIGINS: parseAllowedOrigins(),
};

export default config;
