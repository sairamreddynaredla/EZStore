import prisma from "../../database/prismaClient.js";
import paymentFactory from "./paymentFactory.js";
import { computeOrderSubtotal } from "../shared/priceCalculator.js";
import couponService from "../shared/couponService.js";
import { applyInventoryForStatus } from "../admin/orderService.js";
import {
  generateOrderNumber,
  generatePaymentNumber,
  generateTransactionId,
  generateRefundNumber,
} from "../../utils/transactionIdGenerator.js";
import config from "../../config/index.js";
import logger from "../../utils/logger.js";
import { getSocket } from "../../socket.js";
import bcrypt from "bcrypt";

const DEFAULT_TAX_RATE = 0.1;
const SHIPPING_RATES = { standard: 0, express: 99 };

const normalizeString = (val) => (typeof val === "string" ? val.trim() : "");
const normalizeEmail = (val) => String(val || "").trim().toLowerCase();

export class PaymentService {
  async getPaymentConfig() {
    return {
      stripeEnabled: true,
      publishableKey: config.STRIPE_PUBLISHABLE_KEY,
      defaultCurrency: config.DEFAULT_CURRENCY || "USD",
    };
  }

  async getOrCreateCustomer(user, customerEmail, customerName, customerPhone) {
    if (user?.id) {
      const existing = await prisma.customer.findUnique({ where: { id: Number(user.id) } });
      if (existing) return existing;
    }

    const email = normalizeEmail(customerEmail);
    if (!email) {
      throw Object.assign(new Error("Guest checkout requires a valid email address"), { status: 400 });
    }

    let customer = await prisma.customer.findUnique({ where: { email } });
    if (customer) return customer;

    const dummyPassword = `${email}-${Date.now()}`;
    const hashedPassword = await bcrypt.hash(dummyPassword, 10);

    customer = await prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        fullName: normalizeString(customerName) || "Guest Customer",
        phone: normalizeString(customerPhone) || null,
        status: "active",
      },
    });

    return customer;
  }

  async createOrderAndInitializePayment({
    user,
    items,
    totalAmount,
    couponCode,
    shippingAddress,
    customerEmail,
    customerName,
    customerPhone,
    paymentMethod = "stripe",
    currency = "USD",
    metadata = {},
    idempotencyKey,
  }) {
    const requestedMethod = normalizeString(paymentMethod).toLowerCase();
    if (requestedMethod !== "stripe" && requestedMethod !== "card") {
      throw Object.assign(new Error("Only Stripe card payments are supported."), { status: 400, code: "UNSUPPORTED_PAYMENT_PROVIDER" });
    }
    const providerName = "stripe";
    const provider = paymentFactory.getProvider(providerName);

    if (!provider.isConfigured()) {
      throw Object.assign(new Error(`Payment provider '${provider.name}' is currently unavailable.`), { status: 503, code: "PROVIDER_UNAVAILABLE" });
    }

    // Server-side price validation
    const productIds = Array.from(new Set((items || []).map((it) => Number(it.id)).filter(Boolean)));
    const productSlugs = Array.from(new Set((items || []).map((it) => normalizeString(it.productSlug || it.slug)).filter(Boolean)));

    if (!productIds.length && !productSlugs.length) {
      throw Object.assign(new Error("Order must contain valid products"), { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          ...(productIds.length ? [{ id: { in: productIds } }] : []),
          ...(productSlugs.length ? [{ slug: { in: productSlugs } }] : []),
        ],
      },
    });

    const computedSubtotal = computeOrderSubtotal(items, products);

    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const couponResult = await couponService.validateAndComputeCoupon({
        code: couponCode,
        customerId: user?.id || null,
        subtotal: computedSubtotal,
        items,
      });
      discountAmount = Number(couponResult.discountAmount || 0);
      appliedCoupon = couponResult.coupon || null;
    }

    const deliveryMethod = normalizeString(metadata?.deliveryMethod).toLowerCase() === "express" ? "express" : "standard";
    const shippingAmount = appliedCoupon?.freeShipping ? 0 : SHIPPING_RATES[deliveryMethod] ?? 0;
    const taxableBase = Math.max(0, computedSubtotal - discountAmount);
    const taxAmount = Math.round(taxableBase * DEFAULT_TAX_RATE * 100) / 100;
    const finalTotal = Math.max(0, Math.round((computedSubtotal - discountAmount + shippingAmount + taxAmount) * 100) / 100);

    const customer = await this.getOrCreateCustomer(user, customerEmail, customerName || shippingAddress?.recipientName, customerPhone);
    const orderNumber = generateOrderNumber();
    const paymentNumber = generatePaymentNumber();

    // Initialize provider order/intent
    const providerData = await provider.createPaymentOrder({
      orderNumber,
      amount: finalTotal,
      currency,
      customer: { email: customer.email, fullName: customer.fullName, phone: customer.phone },
      metadata,
      idempotencyKey,
    });

    // Create DB Order, Payment, and Transaction inside database transaction
    const result = await prisma.$transaction(async (tx) => {
      let shippingAddressId = null;
      if (shippingAddress && typeof shippingAddress === "object" && shippingAddress.street) {
        const addr = await tx.address.create({
          data: {
            customerId: customer.id,
            label: shippingAddress.label || "Home",
            recipientName: shippingAddress.recipientName || shippingAddress.fullName || customer.fullName || "Customer",
            phone: shippingAddress.phone || customer.phone || "",
            street: shippingAddress.street,
            city: shippingAddress.city || "",
            state: shippingAddress.state || "",
            postalCode: shippingAddress.postalCode || "",
            country: shippingAddress.country || "India",
          },
        });
        shippingAddressId = addr.id;
      }

      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          orderNumber,
          totalAmount: finalTotal,
          items,
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: provider.name,
          currency,
          shippingAddressId,
          metadata: {
            ...metadata,
            shippingAmount,
            taxAmount,
            discountAmount,
          },
          couponId: appliedCoupon?.id || null,
        },
      });

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          method: providerName,
          provider: provider.name,
          status: "pending",
          transactionId: providerData.providerOrderId || null,
          paymentIntentId: providerData.providerOrderId || null,
          stripeCustomerId: providerData.stripeCustomerId || null,
          amount: finalTotal,
          currency,
          metadata: {
            paymentNumber,
            customerId: customer.id,
            providerOrderId: providerData.providerOrderId || null,
            ...metadata,
            providerData,
          },
        },
      });

      let initialTransaction = null;
      if (tx.transaction) {
        try {
          initialTransaction = await tx.transaction.create({
            data: {
              transactionId: generateTransactionId(),
              paymentId: payment.id,
              orderId: order.id,
              provider: provider.name,
              providerTransactionId: providerData.providerOrderId || null,
              type: "charge",
              status: "pending",
              amount: finalTotal,
              currency,
              gatewayResponse: providerData,
            },
          });
        } catch (txnErr) {
          logger.warn("payment.transaction_log_fallback", { error: String(txnErr) });
        }
      }

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "pending",
          paymentStatus: "pending",
          actorType: "customer",
          actorId: customer.id,
          note: `Order initiated awaiting payment via ${provider.name}`,
        },
      });

      return { order, payment, initialTransaction };
    });

    try {
      const socket = getSocket();
      socket.to("admins").emit("dashboardSummaryUpdated", { event: "newOrder", order: result.order });
    } catch {
      // socket non-blocking
    }

    return {
      order: result.order,
      payment: result.payment,
      providerData,
      stripe: {
        clientSecret: providerData.clientSecret || providerData.providerOrderId,
        paymentIntentId: providerData.providerOrderId,
      },
      serverCalculation: { subtotal: computedSubtotal, discount: discountAmount, shipping: shippingAmount, tax: taxAmount, finalTotal },
    };
  }

  async getCustomerPaymentHistory(customerId) {
    return prisma.payment.findMany({
      where: {
        OR: [
          { order: { customerId: Number(customerId) } },
          { metadata: { path: ["customerId"], equals: Number(customerId) } },
        ],
      },
      include: {
        order: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPaymentDetails(paymentIdOrOrderId, user) {
    const numericId = Number(paymentIdOrOrderId);
    const payment = await prisma.payment.findFirst({
      where: { OR: [{ id: numericId }, { orderId: numericId }] },
      include: {
        order: { include: { orderItems: true, shippingAddress: true } },
      },
    });

    if (!payment) {
      throw Object.assign(new Error("Payment record not found"), { status: 404 });
    }

    const customerId = payment.order?.customerId || payment.metadata?.customerId;
    const isAdmin = user?.role && String(user.role).toLowerCase().includes("admin");
    if (!isAdmin && customerId && customerId !== Number(user?.id)) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }

    return payment;
  }

  async processRefund({ paymentId, amount, reason, adminUser }) {
    const payment = await prisma.payment.findUnique({
      where: { id: Number(paymentId) },
      include: { order: true },
    });

    if (!payment) {
      throw Object.assign(new Error("Payment not found"), { status: 404 });
    }

    if (payment.status !== "paid") {
      throw Object.assign(new Error("Only paid orders can be refunded"), { status: 400 });
    }

    const providerInstance = paymentFactory.getProvider(payment.provider || payment.method);
    const refundAmount = amount ? Number(amount) : payment.amount;

    if (refundAmount > payment.amount + 0.005) {
      throw Object.assign(new Error("Refund amount cannot exceed payment total"), { status: 400 });
    }

    const refundResult = await providerInstance.processRefund({
      transactionId: payment.transactionId || payment.metadata?.providerOrderId,
      amount: refundAmount,
      currency: payment.currency,
      reason,
    });

    const isFullRefund = refundAmount >= payment.amount - 0.005;

    const result = await prisma.$transaction(async (tx) => {
      let refundRecord = null;
      if (tx.refund) {
        try {
          refundRecord = await tx.refund.create({
            data: {
              refundNumber: generateRefundNumber(),
              paymentId: payment.id,
              orderId: payment.orderId,
              provider: providerInstance.name,
              providerRefundId: refundResult.refundId || null,
              amount: refundAmount,
              currency: payment.currency,
              reason,
              status: refundResult.success ? "completed" : "failed",
            },
          });
        } catch (rErr) {
          logger.warn("processRefund.refund_log_fallback", { error: String(rErr) });
        }
      }

      if (refundResult.success && isFullRefund) {
        await tx.payment.update({ where: { id: payment.id }, data: { status: "refunded" } });
        await tx.order.update({ where: { id: payment.orderId }, data: { status: "refund_completed", paymentStatus: "refunded" } });
      }

      if (tx.transaction) {
        try {
          await tx.transaction.create({
            data: {
              transactionId: generateTransactionId(),
              paymentId: payment.id,
              orderId: payment.orderId,
              provider: providerInstance.name,
              providerTransactionId: refundResult.refundId || null,
              type: "refund",
              status: refundResult.success ? "success" : "failed",
              amount: refundAmount,
              currency: payment.currency,
              gatewayResponse: refundResult.rawResponse || {},
            },
          });
        } catch (tErr) {
          logger.warn("processRefund.transaction_log_fallback", { error: String(tErr) });
        }
      }

      await tx.orderStatusHistory.create({
        data: {
          orderId: payment.orderId,
          status: isFullRefund ? "refund_completed" : payment.order.status,
          paymentStatus: isFullRefund ? "refunded" : payment.order.paymentStatus,
          actorType: "admin",
          actorId: adminUser?.id ? Number(adminUser.id) : null,
          note: `Refund of ${refundAmount} ${payment.currency} processed via ${providerInstance.name}`,
        },
      });

      return refundRecord;
    });

    return result;
  }
}

const paymentService = new PaymentService();
export default paymentService;
