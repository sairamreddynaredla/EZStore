import express from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwtAuth, { optionalJwtAuth } from "../middleware/jwtAuth.js";
import prisma from "../../database/prismaClient.js";
import { getSocket } from "../../socket.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";

const router = express.Router();

const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;

const orderCreateSchema = z.object({
  items: z.array(z.any()).min(1, "Order must contain at least one item"),
  totalAmount: z.coerce.number().positive("Order total amount must be a positive number"),
  shippingAddress: z.any().optional(),
  customerEmail: z.string().email("Valid email is required").optional(),
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

router.get("/:orderId", jwtAuth, async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: req.user.id },
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
    const { items, totalAmount, shippingAddress, customerEmail } = req.body;
    let customerId = req.user?.id;

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

      const createdOrder = await transaction.order.create({
        data: {
          customerId,
          orderNumber: generateOrderNumber(),
          totalAmount,
          items,
          status: "processing",
          paymentStatus: "paid",
          metadata: { createdVia: "customer_checkout" },
          shippingAddressId: createdAddressId,
        },
      });

      await transaction.payment.create({
        data: {
          orderId: createdOrder.id,
          method: "Card",
          status: "completed",
          provider: "MockPayment",
          transactionId: `mock_${Date.now()}`,
          amount: totalAmount,
          currency: "USD",
        }
      });

      await transaction.orderStatusHistory.create({
        data: {
          orderId: createdOrder.id,
          status: createdOrder.status,
          paymentStatus: createdOrder.paymentStatus,
          actorType: "customer",
          actorId: customerId,
          note: "Order placed and paid (Mock)",
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

    if (!(["pending", "confirmed", "processing"].includes(order.status))) {
      return sendError(res, "This order cannot be cancelled anymore", { status: 400 });
    }

    const nextOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "cancelled",
        paymentStatus: order.paymentStatus === "paid" ? "refunded" : order.paymentStatus,
        metadata: { ...(order.metadata || {}), cancelledAt: new Date().toISOString(), cancelledBy: "customer" },
      },
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

    if (order.status !== "delivered") {
      return sendError(res, "Only delivered orders can be returned", { status: 400 });
    }

    const nextOrder = await prisma.order.update({ where: { id: order.id }, data: { status: "returned", metadata: { ...(order.metadata || {}), returnRequestedAt: new Date().toISOString() } } });
    await prisma.orderStatusHistory.create({ data: { orderId: nextOrder.id, status: nextOrder.status, actorType: "customer", actorId: req.user.id, note: "Return requested" } });
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

    const nextOrder = await prisma.order.update({ where: { id: order.id }, data: { status: "refund_requested", metadata: { ...(order.metadata || {}), refundRequestedAt: new Date().toISOString(), refundReason: req.body?.reason || null } } });
    await prisma.orderStatusHistory.create({ data: { orderId: nextOrder.id, status: nextOrder.status, actorType: "customer", actorId: req.user.id, note: "Refund requested" } });
    await prisma.notification.create({ data: { customerId: req.user.id, title: "Refund requested", message: `Your refund request for order ${nextOrder.orderNumber} has been submitted.`, type: "order_update", channel: "in_app" } });

    return sendSuccess(res, { order: nextOrder }, { message: "Refund requested" });
  } catch (err) {
    return next(err);
  }
});

export default router;
