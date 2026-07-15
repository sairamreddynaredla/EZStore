import express from "express";
import healthRouter from "../controllers/healthController.js";
import adminRouter from "./admin.js";
import authRouter from "./user/auth.js";
import ordersRouter from "./user/orders.js";
import customerCommerceRouter from "./user/customerCommerce.js";
import addressesRouter from "./user/addresses.js";

const router = express.Router();

router.use("/health", healthRouter);
router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/orders", ordersRouter);
router.use("/customer", customerCommerceRouter);
router.use("/addresses", addressesRouter);

// Future routes will be mounted under /api/products, etc.

export default router;
