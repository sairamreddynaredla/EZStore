import express from "express";
import jwtAuth, { optionalJwtAuth } from "./middleware/jwtAuth.js";
import requireAdmin from "./middleware/requireAdmin.js";
import { validateRequest } from "./middleware/validateRequest.js";
import {
  orderCreateSchema,
  refundSchema,
  paymentIdParamSchema,
  orderIdParamSchema,
} from "../validators/paymentValidator.js";
import {
  getPaymentConfig,
  createOrder,
  getCustomerHistory,
  getPaymentById,
  requestRefund,
} from "../controllers/paymentController.js";
import { handleWebhook } from "../controllers/webhookController.js";


const router = express.Router();

// Public payment configuration endpoint
router.get("/config", getPaymentConfig);

// Create an order and a Stripe PaymentIntent.
router.post("/create-order", optionalJwtAuth, validateRequest(orderCreateSchema), createOrder);

// Stripe signs and confirms all payment state changes through this webhook.
router.post("/webhook", handleWebhook("stripe"));
router.post("/webhook/stripe", handleWebhook("stripe"));

// Customer payment history (authenticated)
router.get("/customer", jwtAuth, getCustomerHistory);

// Payment details by Order ID
router.get("/order/:orderId", jwtAuth, validateRequest({ params: orderIdParamSchema }), getPaymentById);

// Payment details by Payment ID
router.get("/:paymentId", jwtAuth, validateRequest({ params: paymentIdParamSchema }), getPaymentById);

// Refund processing (Admin only)
router.post(
  "/:paymentId/refund",
  jwtAuth,
  requireAdmin,
  validateRequest({ params: paymentIdParamSchema, body: refundSchema }),
  requestRefund
);

export default router;
