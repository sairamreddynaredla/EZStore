import express from "express";
import healthRouter from "../controllers/healthController.js";
import adminRouter from "./admin.js";
import authRouter from "./auth.js";
import ordersRouter from "./orders.js";
import wishlistRouter from "./wishlist.js";
import addressesRouter from "./addresses.js";

const router = express.Router();

router.use("/health", healthRouter);
router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/orders", ordersRouter);
router.use("/wishlist", wishlistRouter);
router.use("/addresses", addressesRouter);

// Future routes will be mounted under /api/products, etc.

export default router;
