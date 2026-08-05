import express from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwtAuth, { optionalJwtAuth } from "../middleware/jwtAuth.js";
import prisma from "../../database/prismaClient.js";
import couponService from "../../services/shared/couponService.js";
import { getSocket } from "../../socket.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";
import { createRefundRequest, updateOrderStatus } from "../../services/admin/orderService.js";

const router = express.Router();

const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const orderCreateSchema = z.object({
  items: z.array(z.any()).min(1, "Order must contain at least one item"),
  totalAmount: z.coerce.number().positive("Order total amount must be a positive number"),
  couponCode: z.string().trim().optional(),
  shippingAddress: z.any().optional(),
  customerEmail: z.string().email("Valid email is required").optional(),
  paymentMethod: z.string().trim().optional(),
  currency: z.string().trim().optional(),
  metadata: z.record(z.any()).optional(),
});

router.get("/", jwtAuth, async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = String(req.query.q || "").trim();
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    const where = {
      customerId: req.user.id,
      ...(search ? { OR: [{ orderNumber: { contains: search, mode: "insensitive" } }, { status: { contains: search, mode: "insensitive" } }] } : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, orderBy: { placedAt: "desc" }, skip, take: safeLimit }),
      prisma.order.count({ where }),
    ]);

    return sendSuccess(res, { orders, total, page: safePage, pageSize: safeLimit }, { message: "Orders loaded" });
  } catch (err) {
    return next(err);
  }
});

router.get("/:orderId", optionalJwtAuth, async (req, res, next) => {
  try {
    const rawId = String(req.params.orderId || "").trim();
    const isNumericId = /^[0-9]+$/.test(rawId);
    const where = isNumericId
      ? { id: Number(rawId) }
      : { orderNumber: rawId };

    if (req.user?.id) {
      where.customerId = Number(req.user.id);
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        shippingAddress: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
        notes: { orderBy: { createdAt: "desc" } },
        payment: true,
      },
    });

    if (!order) {
      return sendError(res, "Order not found", { status: 404 });
    }

    return sendSuccess(res, { order }, { message: "Order loaded" });
  } catch (err) {
    return next(err);
  }
});

router.post("/", optionalJwtAuth, validateRequest(orderCreateSchema), async (req, res, next) => {
  try {
    const { items, totalAmount, shippingAddress, customerEmail, paymentMethod, currency, metadata, couponCode } = req.body;
    let customerId = req.user?.id;
    const normalizedPaymentMethod = normalizeString(paymentMethod).toLowerCase() || "stripe";
    const isStripePayment = normalizedPaymentMethod === "stripe" || normalizedPaymentMethod === "card";

    if (!isStripePayment) {
      return sendError(res, "Unsupported payment method. Only Stripe is accepted.", { status: 400 });
    }

    // Server-side price validation: compute authoritative subtotal from DB
    const productIds = Array.from(new Set((items || []).map((it) => Number(it.id)).filter(Boolean)));
    if (!productIds.length) {
      return sendError(res, "Order must contain at least one valid product id", { status: 400 });
    }

    const products = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, price: true, metadata: true, stock: true } });
    // Fetch full product inventory fields for validation. Some databases
    // may be missing the `trackInventory` column or other newer schema
    // fields. Select only the fields actually used in validation.
    let fullProducts = [];
    try {
      fullProducts = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, stock: true, status: true, trackInventory: true, isActive: true } });
    } catch (err) {
      const msg = String(err?.message || "").toLowerCase();
      if (msg.includes("trackinventory") || msg.includes("column") || msg.includes("does not exist")) {
        fullProducts = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, stock: true, status: true, isActive: true } });
      } else {
        throw err;
      }
    }
    let computedSubtotal;
    try {
      const { computeOrderSubtotal } = await import("../../services/shared/priceCalculator.js");
      computedSubtotal = computeOrderSubtotal(items, products);
    } catch (err) {
      return sendError(res, err.message || "Invalid order items", { status: 400 });
    }
    const clientTotal = Number(totalAmount ?? 0);
    let discountAmount = 0;
    let appliedCoupon = null;

    // Validate coupon server-side if provided
    // `couponCode` is destructured from the request body above. Normalize it once.
    const normalizedCouponCode = normalizeString(couponCode || "");
    if (normalizedCouponCode) {
      try {
        const result = await couponService.validateAndComputeCoupon({ code: normalizedCouponCode, customerId: req.user?.id || null, subtotal: computedSubtotal, items });
        discountAmount = Number(result.discountAmount || 0);
        appliedCoupon = result.coupon || null;
      } catch (cErr) {
        return sendError(res, cErr.message || "Invalid coupon", { status: cErr.status || 400 });
      }
    }

    let finalTotal = Number(computedSubtotal) - Number(discountAmount || 0);
    if (finalTotal < 0) finalTotal = 0;

    // --- Inventory & availability validation ---
    const failures = [];
    const productById = Object.fromEntries(fullProducts.map((p) => [String(p.id), p]));

    for (const it of items) {
      const pid = String(it.id || it.productId || "");
      const qty = Number(it.quantity ?? it.qty ?? 1);
      const prod = productById[pid];
      if (!prod) {
        failures.push({ id: pid, reason: "Product does not exist" });
        continue;
      }

      if (String(prod.status) === "discontinued") {
        failures.push({ id: prod.id, name: prod.name, reason: "Product has been discontinued" });
        continue;
      }

      if (prod.isActive === false) {
        failures.push({ id: prod.id, name: prod.name, reason: "Product is not active" });
        continue;
      }

      const track = prod.trackInventory === undefined ? true : Boolean(prod.trackInventory);
      const availableStock = Number(prod.stock ?? 0);
      if (track && availableStock < qty) {
        failures.push({ id: prod.id, name: prod.name, reason: `Insufficient stock (requested ${qty}, available ${availableStock})` });
        continue;
      }
    }

    if (failures.length) {
      return sendError(res, "Some items in the cart are unavailable", { status: 400, data: { failures } });
    }

    if (!customerId) {
      if (!customerEmail) {
        return sendError(res, "Guest checkout requires an email address", { status: 400 });
      }

      const normalizedEmail = String(customerEmail).trim().toLowerCase();
      let customer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });

      if (!customer) {
        const password = `${normalizedEmail}-${Date.now()}`;
        const hashedPassword = await bcrypt.hash(String(password), 10);
        const newCustomerName = shippingAddress?.recipientName || shippingAddress?.fullName || "Guest Customer";
        
        customer = await prisma.customer.create({
          data: {
            email: normalizedEmail,
            password: hashedPassword,
            fullName: newCustomerName,
            status: "active",
          },
        });
      }

      customerId = customer.id;
    }

    const addressData = shippingAddress && typeof shippingAddress === "object" ? {
      customerId,
      label: shippingAddress.label || "Home",
      recipientName: shippingAddress.recipientName || shippingAddress.fullName || "",
      phone: shippingAddress.phone || "",
      street: shippingAddress.street || "",
      city: shippingAddress.city || "",
      state: shippingAddress.state || "",
      postalCode: shippingAddress.postalCode || "",
      country: shippingAddress.country || "United States",
      isDefault: false,
    } : null;

    const order = await prisma.$transaction(async (transaction) => {
      let createdAddressId = null;
      if (addressData && addressData.street && addressData.city && addressData.state && addressData.postalCode) {
        const newAddress = await transaction.address.create({ data: addressData });
        createdAddressId = newAddress.id;
      }

      const paymentMethodLabel = "Stripe";
      const currencyCode = normalizeString(currency) || "USD";

      const createdOrder = await transaction.order.create({
        data: {
          customerId,
          orderNumber: generateOrderNumber(),
          // persist server-authoritative total
          totalAmount: finalTotal,
          items,
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: paymentMethodLabel,
          currency: currencyCode,
          metadata: { createdVia: "customer_checkout", ...(metadata || {}) },
          couponId: appliedCoupon?.id || null,
          shippingAddressId: createdAddressId,
        },
      });

      const paymentRecord = await transaction.payment.create({
        data: {
          orderId: createdOrder.id,
          method: paymentMethodLabel,
          status: "pending",
          provider: "Stripe",
          transactionId: null,
          amount: finalTotal,
          currency: currencyCode,
          metadata: {
            ...(metadata || {}),
            paymentMethod: "stripe",
            coupon: appliedCoupon ? { id: appliedCoupon.id, code: appliedCoupon.code, discount: discountAmount } : undefined,
          },
        },
      });

      if (appliedCoupon) {
        // Lock coupon row and re-validate inside transaction
        const locked = await transaction.$queryRaw`SELECT * FROM "Coupon" WHERE id = ${appliedCoupon.id} FOR UPDATE`;
        const lockedRow = Array.isArray(locked) ? locked[0] : locked;
        if (!lockedRow) throw new Error("Coupon not found during transaction");

        if (lockedRow.usageLimit && lockedRow.usageCount >= lockedRow.usageLimit) {
          throw Object.assign(new Error("Usage limit exceeded"), { status: 400 });
        }

        if (customerId && lockedRow.perUserLimit) {
          const usedByCustomer = await transaction.couponUsage.count({ where: { couponId: appliedCoupon.id, customerId } });
          if (usedByCustomer >= lockedRow.perUserLimit) throw Object.assign(new Error("Coupon already used by this customer"), { status: 400 });
        }

        if (lockedRow.minOrderAmount && Number(computedSubtotal) < Number(lockedRow.minOrderAmount)) {
          throw Object.assign(new Error("Minimum order amount not met"), { status: 400 });
        }

        await transaction.couponUsage.create({ data: { couponId: appliedCoupon.id, customerId, orderId: createdOrder.id } });
        await transaction.coupon.update({ where: { id: appliedCoupon.id }, data: { usageCount: { increment: 1 } } });
      }

      await transaction.orderStatusHistory.create({
        data: {
          orderId: createdOrder.id,
          status: createdOrder.status,
          paymentStatus: createdOrder.paymentStatus,
          actorType: "customer",
          actorId: customerId,
          note: "Order placed and awaiting payment",
        },
      });

      return createdOrder;
    });

    try {
      const socket = getSocket();
      socket.to("admins").emit("dashboardSummaryUpdated", {
        event: "newOrder",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          createdAt: order.placedAt || new Date().toISOString(),
        },
      });
    } catch {
      // If sockets are not ready yet, continue without blocking the order creation.
    }

    return sendSuccess(res, { order }, { message: "Order created successfully" });
  } catch (err) {
    return next(err);
  }
});

router.post("/:orderId/cancel", jwtAuth, async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await prisma.order.findFirst({ where: { id: orderId, customerId: req.user.id } });
    if (!order) {
      return sendError(res, "Order not found", { status: 404 });
    }

    const nextOrder = await updateOrderStatus(order.id, "cancelled", {
      actor: { type: "customer", id: req.user.id },
      note: "Order cancelled by customer",
    });

    await prisma.orderStatusHistory.create({ data: { orderId: nextOrder.id, status: nextOrder.status, paymentStatus: nextOrder.paymentStatus, actorType: "customer", actorId: req.user.id, note: "Order cancelled by customer" } });
    await prisma.notification.create({ data: { customerId: req.user.id, title: "Order cancelled", message: `Your order ${nextOrder.orderNumber} has been cancelled.`, type: "order_update", channel: "in_app" } });

    return sendSuccess(res, { order: nextOrder }, { message: "Order cancelled" });
  } catch (err) {
    return next(err);
  }
});

router.post("/:orderId/returns", jwtAuth, async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await prisma.order.findFirst({ where: { id: orderId, customerId: req.user.id } });
    if (!order) {
      return sendError(res, "Order not found", { status: 404 });
    }

    const nextOrder = await updateOrderStatus(order.id, "returned", {
      actor: { type: "customer", id: req.user.id },
      note: "Return requested by customer",
    });

    await prisma.notification.create({ data: { customerId: req.user.id, title: "Return requested", message: `Your return request for order ${nextOrder.orderNumber} is being reviewed.`, type: "order_update", channel: "in_app" } });

    return sendSuccess(res, { order: nextOrder }, { message: "Return requested" });
  } catch (err) {
    return next(err);
  }
});

router.post("/:orderId/refunds", jwtAuth, async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await prisma.order.findFirst({ where: { id: orderId, customerId: req.user.id } });
    if (!order) {
      return sendError(res, "Order not found", { status: 404 });
    }

    if (!(["delivered", "returned"].includes(order.status))) {
      return sendError(res, "Only delivered or returned orders can request a refund", { status: 400 });
    }

    const nextOrder = await createRefundRequest(order.id, {
      actor: { type: "customer", id: req.user.id },
      reason: req.body?.reason || null,
      note: "Refund requested by customer",
    });
    await prisma.notification.create({ data: { customerId: req.user.id, title: "Refund requested", message: `Your refund request for order ${nextOrder.orderNumber} has been submitted.`, type: "order_update", channel: "in_app" } });

    return sendSuccess(res, { order: nextOrder }, { message: "Refund requested" });
  } catch (err) {
    return next(err);
  }
});

export default router;
