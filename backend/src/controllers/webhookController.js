import paymentFactory from "../services/payment/paymentFactory.js";
import prisma from "../database/prismaClient.js";
import logger from "../utils/logger.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { getSocket } from "../socket.js";
import { generateTransactionId } from "../utils/transactionIdGenerator.js";
import { applyInventoryForStatus } from "../services/admin/orderService.js";

export const handleWebhook = (providerKey) => async (req, res, next) => {
  try {
    const providerName = providerKey || req.params.provider || "stripe";
    const providerInstance = paymentFactory.getProvider(providerName);

    let parsedEvent;
    try {
      parsedEvent = await providerInstance.parseWebhookEvent(req);
    } catch (parseErr) {
      logger.error("webhook.parse_error", { provider: providerName, error: String(parseErr) });
      return sendError(res, parseErr.message || "Invalid webhook signature or payload", { status: 400 });
    }

    const { eventId, eventType, status: webhookStatus, orderNumber, providerOrderId, payload } = parsedEvent;

    // Deduplicate: log into WebhookLog table if available
    if (prisma.webhookLog) {
      try {
        await prisma.webhookLog.create({
          data: {
            provider: providerInstance.name,
            eventId: eventId || `${providerName}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            eventType: eventType || "unknown",
            payload,
            status: "processing",
          },
        });
      } catch (createErr) {
        logger.info("webhook.duplicate_event_ignored", { provider: providerName, eventId });
        return sendSuccess(res, { message: "Webhook ignored: duplicate event" });
      }
    }

    if (webhookStatus === "ignored" || (!orderNumber && !providerOrderId)) {
      if (prisma.webhookLog) {
        await prisma.webhookLog.updateMany({ where: { eventId }, data: { status: "ignored" } });
      }
      return sendSuccess(res, { message: "Webhook event acknowledged but ignored" });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          ...(providerOrderId ? [{ transactionId: providerOrderId }] : []),
          ...(orderNumber ? [{ order: { orderNumber } }] : []),
        ],
      },
      include: { order: true },
    });

    if (!payment) {
      logger.warn("webhook.payment_not_found", { provider: providerName, eventId, orderNumber, providerOrderId });
      if (prisma.webhookLog) {
        await prisma.webhookLog.updateMany({ where: { eventId }, data: { status: "ignored", errorMessage: "Payment record not found" } });
      }
      return sendSuccess(res, { message: "Webhook acknowledged: payment not found" });
    }

    // Process payment status transition
    if (webhookStatus === "paid") {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "paid" },
        });

        if (payment.order.status === "pending") {
          await applyInventoryForStatus(tx, payment.order, "processing", null);
        }
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: "paid",
            status: payment.order.status === "pending" ? "processing" : payment.order.status,
          },
        });

        if (tx.transaction) {
          try {
            await tx.transaction.create({
              data: {
                transactionId: generateTransactionId(),
                paymentId: payment.id,
                orderId: payment.orderId,
                provider: providerInstance.name,
                providerTransactionId: providerOrderId || payment.transactionId,
                type: "charge",
                status: "success",
                amount: payment.amount,
                currency: payment.currency,
                gatewayResponse: payload,
              },
            });
          } catch (tErr) {
            logger.warn("webhook.transaction_log_fallback", { error: String(tErr) });
          }
        }

        await tx.orderStatusHistory.create({
          data: {
            orderId: payment.orderId,
            status: payment.order.status === "pending" ? "processing" : payment.order.status,
            paymentStatus: "paid",
            actorType: "system",
            note: `Payment confirmed via ${providerInstance.name} webhook`,
          },
        });
      });
    } else if (webhookStatus === "failed") {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
        await tx.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "failed" } });
        if (tx.transaction) {
          try {
            await tx.transaction.create({
              data: {
                transactionId: generateTransactionId(),
                paymentId: payment.id,
                orderId: payment.orderId,
                provider: providerInstance.name,
                providerTransactionId: providerOrderId || null,
                type: "charge",
                status: "failed",
                amount: payment.amount,
                currency: payment.currency,
                gatewayResponse: payload,
              },
            });
          } catch (tErr) {
            logger.warn("webhook.transaction_log_fallback", { error: String(tErr) });
          }
        }
      });
    } else if (webhookStatus === "refunded") {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({ where: { id: payment.id }, data: { status: "refunded" } });
        await tx.order.update({ where: { id: payment.orderId }, data: { status: "refund_completed", paymentStatus: "refunded" } });
        if (tx.transaction) {
          try {
            await tx.transaction.create({
              data: {
                transactionId: generateTransactionId(),
                paymentId: payment.id,
                orderId: payment.orderId,
                provider: providerInstance.name,
                providerTransactionId: providerOrderId || null,
                type: "refund",
                status: "success",
                amount: payment.amount,
                currency: payment.currency,
                gatewayResponse: payload,
              },
            });
          } catch (tErr) {
            logger.warn("webhook.transaction_log_fallback", { error: String(tErr) });
          }
        }
      });
    }

    if (prisma.webhookLog) {
      await prisma.webhookLog.updateMany({ where: { eventId }, data: { status: "processed", processedAt: new Date() } });
    }

    try {
      const socket = getSocket();
      socket.to(`order_${payment.orderId}`).emit("orderUpdated", { orderId: payment.orderId, status: webhookStatus });
    } catch {
      // non-blocking
    }

    return sendSuccess(res, { message: `Webhook processed for ${providerInstance.name}` });
  } catch (err) {
    logger.error("webhook.controller_error", { error: String(err) });
    return next(err);
  }
};
