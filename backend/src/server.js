import createApp from "./app.js";
import config from "./config/index.js";
import { initSocket } from "./socket.js";

const app = createApp();
const port = config.PORT || 5000;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`EZStore backend listening on http://localhost:${port}`);
  // Stripe configuration visibility
  try {
    const stripeConfigured = Boolean(config.STRIPE_SECRET_KEY && config.STRIPE_PUBLISHABLE_KEY);
    console.log(JSON.stringify({ event: "stripe_startup_status", stripeConfigured, timestamp: new Date().toISOString() }));
  } catch (e) {
    console.warn("Unable to determine Stripe config status", String(e));
  }
});

const allowedSocketOrigins = Array.isArray(config.ALLOWED_ORIGINS) && config.ALLOWED_ORIGINS.length
  ? config.ALLOWED_ORIGINS
  : [config.FRONTEND_URL || "http://localhost:5173", "http://127.0.0.1:5173"];

initSocket(server, {
  origin: allowedSocketOrigins,
});
