import dotenv from "dotenv";
import fs from "fs";

const configuredNodeEnv = process.env.NODE_ENV;
const envFile = configuredNodeEnv ? `.env.${configuredNodeEnv}` : null;

// Deployment environment variables take precedence over local .env values.
dotenv.config({ override: false });
if (envFile && fs.existsSync(envFile)) {
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

const stripeEnvValidators = {
  STRIPE_SECRET_KEY: /^sk_(test|live)_/, 
  STRIPE_PUBLISHABLE_KEY: /^pk_(test|live)_/,
  STRIPE_WEBHOOK_SECRET: /^whsec_/,
};

const isValidStripeEnvironmentValue = (name, value) => {
  const normalized = String(value || "").trim();
  return stripeEnvValidators[name].test(normalized)
    && !/(replace_me|your_|placeholder|example)/i.test(normalized);
};

const missingEnvs = requiredEnvs.filter((name) => !process.env[name]);
const invalidStripeEnvs = Object.entries(stripeEnvValidators)
  .filter(([name]) => !isValidStripeEnvironmentValue(name, process.env[name]))
  .map(([name]) => name);

if (missingEnvs.length > 0) {
  console.error(
    JSON.stringify({
      event: "missing_env_vars",
      message: "Missing required environment variables",
      missing: missingEnvs,
      severity: "fatal",
      timestamp: new Date().toISOString(),
    })
  );
  process.exit(1);
}

if (invalidStripeEnvs.length > 0) {
  console.error(JSON.stringify({
    event: "invalid_stripe_configuration",
    message: "Stripe is required. Set valid STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, and STRIPE_WEBHOOK_SECRET values before starting the backend.",
    invalid: invalidStripeEnvs,
    severity: "fatal",
    timestamp: new Date().toISOString(),
  }));
  process.exit(1);
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
  FRONTEND_URL: process.env.APP_URL || process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
  ALLOWED_ORIGINS: parseAllowedOrigins(),
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_API_VERSION: process.env.STRIPE_API_VERSION || undefined,
};

export default config;
