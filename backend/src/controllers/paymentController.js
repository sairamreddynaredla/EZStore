import paymentService from "../services/payment/paymentService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import logger from "../utils/logger.js";

export const getPaymentConfig = async (req, res, next) => {
  try {
    const configData = await paymentService.getPaymentConfig();
    return sendSuccess(res, configData, { message: "Payment configuration retrieved" });
  } catch (err) {
    return next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const result = await paymentService.createOrderAndInitializePayment({
      user: req.user,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      couponCode: req.body.couponCode,
      shippingAddress: req.body.shippingAddress,
      customerEmail: req.body.customerEmail,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      paymentMethod: req.body.paymentMethod,
      currency: req.body.currency,
      metadata: req.body.metadata,
      idempotencyKey: req.headers["idempotency-key"] || req.headers["idempotency_key"],
    });

    if (result.idempotencyPending) {
      return sendSuccess(res, result, { message: "Payment request is already being processed", status: 202 });
    }

    return sendSuccess(res, result, {
      message: result.idempotencyReplay ? "Payment order replayed" : "Payment order created successfully",
      status: 200,
    });
  } catch (err) {
    logger.error("paymentController.createOrder_failed", { error: String(err) });
    return next(err);
  }
};

export const getCustomerHistory = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return sendError(res, "Authentication required", { status: 401 });
    }
    const history = await paymentService.getCustomerPaymentHistory(req.user.id);
    return sendSuccess(res, { payments: history });
  } catch (err) {
    return next(err);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const paymentId = Number(req.params.paymentId);
    const payment = await paymentService.getPaymentDetails(paymentId, req.user);
    return sendSuccess(res, { payment });
  } catch (err) {
    return next(err);
  }
};

export const getPaymentByOrderId = async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const payment = await paymentService.getPaymentDetails(orderId, req.user);
    return sendSuccess(res, { payment });
  } catch (err) {
    return next(err);
  }
};

export const requestRefund = async (req, res, next) => {
  try {
    const paymentId = Number(req.params.paymentId);
    const refundRecord = await paymentService.processRefund({
      paymentId,
      amount: req.body.amount,
      reason: req.body.reason,
      adminUser: req.user,
    });

    return sendSuccess(res, { refund: refundRecord }, { message: "Refund processed successfully" });
  } catch (err) {
    return next(err);
  }
};
