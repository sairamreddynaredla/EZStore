import logger from "./logger.js";
import config from "../config/index.js";

export const validateEnv = () => {
  try {
    const stripeKeys = {
      secret: Boolean(config.STRIPE_SECRET_KEY),
      publishable: Boolean(config.STRIPE_PUBLISHABLE_KEY),
      webhook: Boolean(config.STRIPE_WEBHOOK_SECRET),
    };

    if (!stripeKeys.secret || !stripeKeys.publishable || !stripeKeys.webhook) {
      throw new Error("Stripe configuration is required but incomplete.");
    }
    logger.info("env.stripe_ok", { message: "Stripe configuration is present (secrets not logged)." });

    return {
      stripeEnabled: true,
    };
  } catch (err) {
    logger.error("env.validation_error", { error: String(err), stack: err?.stack });
    throw err;
  }
};

export default validateEnv;
