import express from "express";
import healthRouter from "../controllers/healthController.js";
import adminRouter from "./admin.js";
import authRouter from "./user/auth.js";
import ordersRouter from "./user/orders.js";
import productsRouter from "./user/products.js";
import brandsRouter from "./user/brands.js";
import customerCommerceRouter from "./user/customerCommerce.js";
import addressesRouter from "./user/addresses.js";
import notificationsRouter from "./user/notifications.js";
import paymentRouter from "./payments.js";
import { handleWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.use("/health", healthRouter);
router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/orders", ordersRouter);
router.use("/payment", paymentRouter);
// Stripe CLI-friendly alias. It uses the same signed Stripe webhook handler.
router.post("/stripe/webhook", handleWebhook("stripe"));
router.use("/products", productsRouter);
router.use("/brands", brandsRouter);
router.use("/customer", customerCommerceRouter);
router.use("/addresses", addressesRouter);
router.use("/notifications", notificationsRouter);

// Future routes will be mounted under /api/products, etc.

export default router;
