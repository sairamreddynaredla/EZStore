import prisma from "../../database/prismaClient.js";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");
const normalizeStatus = (value) => normalizeString(value).toLowerCase();

const ORDER_STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: ["returned", "refund_requested"],
  cancelled: [],
  returned: ["refund_requested"],
  refund_requested: ["refund_completed"],
  refund_completed: [],
};

const INVENTORY_ACTIONS = {
  confirmed: "reserve",
  processing: "reserve",
  packed: "reserve",
  shipped: "reserve",
  out_for_delivery: "reserve",
  delivered: "deduct",
  cancelled: "restore",
  returned: "restore",
  refund_completed: "restore",
};

const toOrderPayload = (order) => {
  if (!order) return null;

  return {
    id: order.id,
    orderId: order.id,
    orderNumber: order.orderNumber,
    orderStatus: order.status,
    status: order.status,
    paymentStatus: order.paymentStatus || order.payment?.status,
    paymentMethod: order.paymentMethod || order.payment?.method,
    customerId: order.customerId,
    customerName: order.customer?.fullName || `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() || order.customer?.email || "Customer",
    customerEmail: order.customer?.email,
    customerPhone: order.customer?.phone || order.shippingAddress?.phone,
    totalAmount: Number(order.totalAmount ?? 0),
    currency: order.currency,
    orderDate: order.orderDate,
    createdAt: order.placedAt,
    updatedAt: order.placedAt,
    items: Array.isArray(order.items) ? order.items : [],
    shippingAddress: order.shippingAddress ? {
      line1: order.shippingAddress.street,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      postalCode: order.shippingAddress.postalCode,
      country: order.shippingAddress.country,
      phone: order.shippingAddress.phone,
    } : null,
    payment: order.payment ? {
      method: order.payment.method,
      status: order.payment.status,
      provider: order.payment.provider,
      transactionId: order.payment.transactionId,
      amount: order.payment.amount,
      currency: order.payment.currency,
      metadata: order.payment.metadata,
      createdAt: order.payment.createdAt,
    } : null,
    trackingNumber: order.trackingNumber || null,
    shippingProvider: order.shippingProvider || null,
    refundReason: order.metadata?.refundReason || order.refundReason || null,
    refundRequestedAt: order.metadata?.refundRequestedAt || order.refundRequestedAt || null,
    refundCompletedAt: order.metadata?.refundCompletedAt || order.refundCompletedAt || null,
    metadata: order.metadata,
    statusHistory: order.statusHistory || [],
    notes: order.notes || [],
  };
};

const buildOrderLookup = (orderId) => {
  const parsedId = Number(orderId);
  return {
    parsedId,
    where: Number.isInteger(parsedId) ? { id: parsedId } : { orderNumber: String(orderId) },
  };
};

const buildWhereClause = (query = {}) => {
  const where = {};
  const search = normalizeString(query.q);
  const orderStatus = normalizeStatus(query.orderStatus);
  const paymentStatus = normalizeStatus(query.paymentStatus);
  const paymentMethod = normalizeString(query.paymentMethod);

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customer: { email: { contains: search, mode: "insensitive" } } },
      { customer: { fullName: { contains: search, mode: "insensitive" } } },
      { customer: { firstName: { contains: search, mode: "insensitive" } } },
      { customer: { lastName: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (orderStatus) {
    where.status = orderStatus;
  }

  if (paymentStatus) {
    where.paymentStatus = paymentStatus;
  }

  if (paymentMethod) {
    where.paymentMethod = paymentMethod;
  }

  if (query.dateFrom || query.dateTo) {
    where.orderDate = {};
    if (query.dateFrom) where.orderDate.gte = new Date(query.dateFrom);
    if (query.dateTo) where.orderDate.lte = new Date(`${query.dateTo}T23:59:59.999Z`);
  }

  return where;
};

const buildOrderBy = (query = {}) => {
  const sortBy = normalizeString(query.sortBy);
  const direction = normalizeString(query.order) === "asc" ? "asc" : "desc";

  switch (sortBy) {
    case "totalAmount":
      return { totalAmount: direction };
    case "customerName":
      return { customer: { fullName: direction } };
    case "orderDate":
    default:
      return { orderDate: direction };
  }
};

export const resolveOrderTransition = (currentStatus, nextStatus) => {
  const current = normalizeStatus(currentStatus);
  const next = normalizeStatus(nextStatus);

  if (!current || !next) {
    return { allowed: false, inventoryAction: "none", reason: "Missing status" };
  }

  const allowedTargets = ORDER_STATUS_TRANSITIONS[current] || [];
  if (allowedTargets.includes(next)) {
    return { allowed: true, inventoryAction: INVENTORY_ACTIONS[next] || "none", reason: "Allowed transition" };
  }

  return { allowed: false, inventoryAction: "none", reason: "Invalid transition" };
};

export const buildOrderDocuments = (order) => ({
  invoice: {
    orderNumber: order.orderNumber,
    customer: order.customerName,
    total: Number(order.totalAmount ?? 0),
    items: Array.isArray(order.items) ? order.items : [],
    status: order.orderStatus || order.status,
    trackingNumber: order.trackingNumber || null,
    shippingProvider: order.shippingProvider || null,
  },
  packingSlip: {
    orderNumber: order.orderNumber,
    items: Array.isArray(order.items) ? order.items : [],
    status: order.orderStatus || order.status,
  },
  shippingLabel: {
    orderNumber: order.orderNumber,
    recipient: order.customerName,
    items: Array.isArray(order.items) ? order.items : [],
    trackingNumber: order.trackingNumber || null,
    shippingProvider: order.shippingProvider || null,
  },
});

export const getOrders = async (query = {}) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const skip = Math.max(0, page - 1) * Math.max(1, limit || 1);
  const where = buildWhereClause(query);
  const orderBy = buildOrderBy(query);

  const [total, items] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy,
      skip: limit === 0 ? undefined : skip,
      take: limit === 0 ? undefined : Math.max(1, limit),
      include: {
        customer: true,
        shippingAddress: true,
        payment: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        notes: { orderBy: { createdAt: "desc" } },
      },
    }),
  ]);

  return {
    items: items.map(toOrderPayload),
    total,
    page: Math.max(1, page),
    pageSize: limit === 0 ? total : Math.max(1, limit),
  };
};

export const getOrder = async (orderId) => {
  const parsedId = Number(orderId);
  const where = Number.isInteger(parsedId) ? { id: parsedId } : { orderNumber: String(orderId) };

  const order = await prisma.order.findFirst({
    where,
    include: {
      customer: true,
      shippingAddress: true,
      payment: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  return toOrderPayload(order);
};

export const applyInventoryForStatus = async (tx, order, nextStatus, actorId = null) => {
  const transition = resolveOrderTransition(order.status, nextStatus);
  if (!transition.allowed) {
    return false;
  }

  if (transition.inventoryAction === "reserve") {
    const items = Array.isArray(order.items) ? order.items : [];
    for (const item of items) {
      const productId = Number(item.productId ?? item.id);
      if (!productId) continue;
      // Lock the product row to avoid concurrent modifications
      const locked = await tx.$queryRaw`SELECT * FROM "Product" WHERE id = ${productId} FOR UPDATE`;
      const product = Array.isArray(locked) ? locked[0] : locked;
      if (!product) continue;
      const quantity = Number(item.quantity ?? 1);
      if (quantity > 0 && Number(product.stock ?? 0) >= quantity) {
        // decrement stock to reserve and record a reserve transaction so we can
        // later detect that this order already reduced stock.
        await tx.product.update({
          where: { id: product.id },
          data: { stock: Math.max(0, Number(product.stock ?? 0) - quantity) },
        });
        await tx.inventoryTransaction.create({
          data: {
            productId: product.id,
            adminId: actorId ? Number(actorId) : null,
            change: -quantity,
            type: "reserve",
            reason: `Order ${order.orderNumber} reserved`,
          },
        });
      }
    }

  if (transition.inventoryAction === "deduct") {
    const items = Array.isArray(order.items) ? order.items : [];
    for (const item of items) {
      const productId = Number(item.productId ?? item.id);
      if (!productId) continue;
      // Lock the product row to avoid race conditions
      const locked = await tx.$queryRaw`SELECT * FROM "Product" WHERE id = ${productId} FOR UPDATE`;
      const product = Array.isArray(locked) ? locked[0] : locked;
      if (!product) continue;
      const quantity = Number(item.quantity ?? 1);
      if (quantity <= 0) continue;

      // If a prior reserve transaction for this order exists, the stock was
      // already decremented during reservation. In that case we should not
      // decrement again — instead mark the reserve as finalized.
      const reserveTx = await tx.inventoryTransaction.findFirst({
        where: {
          productId: product.id,
          reason: { contains: `Order ${order.orderNumber}` },
          type: "reserve",
        },
      });

      if (reserveTx) {
        // update the reserve transaction to a final decrease record for audit
        await tx.inventoryTransaction.update({
          where: { id: reserveTx.id },
          data: { type: "decrease", reason: `Order ${order.orderNumber} paid` },
        });
      } else {
        // No prior reserve found — perform a one-time decrease and log it.
        if (Number(product.stock ?? 0) >= quantity) {
          await tx.product.update({ where: { id: product.id }, data: { stock: Number(product.stock ?? 0) - quantity } });
        } else {
          // never allow negative stock — clamp to zero
          await tx.product.update({ where: { id: product.id }, data: { stock: 0 } });
        }
        await tx.inventoryTransaction.create({
          data: {
            productId: product.id,
            adminId: actorId ? Number(actorId) : null,
            change: -quantity,
            type: "decrease",
            reason: `Order ${order.orderNumber} paid`,
          },
        });
      }
    }
  }

  if (transition.inventoryAction === "restore") {
    const items = Array.isArray(order.items) ? order.items : [];
    for (const item of items) {
      const productId = Number(item.productId ?? item.id);
      if (!productId) continue;
      // Lock the product row to avoid race conditions during restore
      const locked = await tx.$queryRaw`SELECT * FROM "Product" WHERE id = ${productId} FOR UPDATE`;
      const product = Array.isArray(locked) ? locked[0] : locked;
      if (!product) continue;
      const quantity = Number(item.quantity ?? 1);
      if (quantity <= 0) continue;

      // Prevent double-restores: if an increase transaction for this order
      // already exists, skip.
      const existingIncrease = await tx.inventoryTransaction.findFirst({
        where: {
          productId: product.id,
          reason: { contains: `Order ${order.orderNumber}` },
          type: "increase",
        },
      });
      if (existingIncrease) continue;

      await tx.product.update({ where: { id: product.id }, data: { stock: Number(product.stock ?? 0) + quantity } });
      await tx.inventoryTransaction.create({
        data: {
          productId: product.id,
          adminId: actorId ? Number(actorId) : null,
          change: quantity,
          type: "increase",
          reason: `Order ${order.orderNumber} restored`,
        },
      });
      }
    }
  }

  return true;
};

export const createRefundRequest = async (orderId, payload = {}) => {
  const { where } = buildOrderLookup(orderId);
  const order = await prisma.order.findFirst({ where, include: { customer: true } });
  if (!order) return null;

  const actor = payload.actor || {};
  const normalizedReason = normalizeString(payload.reason || payload.refundReason || order.refundReason);
  const normalizedAmount = Number(payload.amount ?? payload.refundAmount ?? order.totalAmount ?? 0);
  const isPartial = Number.isFinite(normalizedAmount) && normalizedAmount > 0 && normalizedAmount < Number(order.totalAmount ?? 0);

  // Validate refund request amount does not exceed order total
  if (Number.isFinite(normalizedAmount) && normalizedAmount > Number(order.totalAmount ?? 0) + 0.005) {
    throw Object.assign(new Error("Refund amount cannot exceed the order total"), { status: 400 });
  }

  if (!order.status || !["delivered", "returned"].includes(order.status)) {
    throw Object.assign(new Error("Refund requests are only available for delivered or returned orders"), { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const refundRequestedAt = new Date().toISOString();
    const metadata = {
      ...(order.metadata || {}),
      lastUpdatedBy: actor.id || null,
      lastUpdatedAt: refundRequestedAt,
      refundRequested: true,
      refundReason: normalizedReason || null,
      refundRequestedAt,
      refundCompletedAt: null,
      refundAmount: Number.isFinite(normalizedAmount) && normalizedAmount > 0 ? normalizedAmount : Number(order.totalAmount ?? 0),
      refundType: isPartial ? "partial" : "full",
      refundDecision: "pending",
    };

    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: "refund_requested",
        metadata,
      },
      include: {
        customer: true,
        shippingAddress: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: "refund_requested",
        paymentStatus: nextOrder.paymentStatus,
        actorType: actor.type || "admin",
        actorId: actor.id ? Number(actor.id) : null,
        note: payload.note || null,
      },
    });

    const note = await tx.orderNote.create({
      data: {
        orderId: order.id,
        authorType: actor.type || "admin",
        authorId: actor.id ? Number(actor.id) : null,
        note: payload.note || `Refund requested: ${normalizedReason || "Customer requested a refund"}`,
        isInternal: true,
      },
    });

    await tx.auditLog.create({
      data: {
        adminId: actor.id ? Number(actor.id) : null,
        action: "update",
        entity: "Order",
        entityId: order.id,
        entityName: order.orderNumber,
        details: {
          action: "refund_requested",
          reason: normalizedReason || null,
          amount: Number.isFinite(normalizedAmount) && normalizedAmount > 0 ? normalizedAmount : Number(order.totalAmount ?? 0),
          isPartial,
        },
      },
    });

    return { order: nextOrder, note };
  });

  return {
    ...toOrderPayload(updated.order),
    note: updated.note,
  };
};

export const resolveRefundRequest = async (orderId, action, payload = {}) => {
  const { where } = buildOrderLookup(orderId);
  const order = await prisma.order.findFirst({ where, include: { customer: true } });
  if (!order) return null;

  const actor = payload.actor || {};
  const normalizedAction = normalizeString(action || payload.action || "approve").toLowerCase();
  const normalizedReason = normalizeString(payload.reason || payload.refundReason || order.refundReason);
  const refundAmount = Number(payload.amount ?? payload.refundAmount ?? order.totalAmount ?? 0);
  const isPartial = Number.isFinite(refundAmount) && refundAmount > 0 && refundAmount < Number(order.totalAmount ?? 0);

  if (order.status !== "refund_requested") {
    throw Object.assign(new Error("Only orders with a pending refund request can be resolved"), { status: 400 });
  }

  if (!["approve", "reject"].includes(normalizedAction)) {
    throw Object.assign(new Error("Refund action must be approve or reject"), { status: 400 });
  }

  // Validate refund amount bounds when approving
  if (normalizedAction === "approve" && (refundAmount <= 0 || refundAmount > Number(order.totalAmount ?? 0) + 0.005)) {
    throw Object.assign(new Error("Invalid refund amount for approval"), { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    // Lock order inside transaction and avoid duplicate resolution
    const lockedOrderRows = await tx.$queryRaw`SELECT * FROM "Order" WHERE id = ${order.id} FOR UPDATE`;
    const lockedOrder = Array.isArray(lockedOrderRows) ? lockedOrderRows[0] : lockedOrderRows;
    if (!lockedOrder) throw new Error("Order not found during refund resolution");

    const nextStatus = normalizedAction === "approve" ? "refund_completed" : (lockedOrder.status === "returned" ? "returned" : "delivered");
    // If already in target state, act idempotently
    if ((lockedOrder.status || "").toLowerCase() === nextStatus) {
      return { order: lockedOrder, note: null };
    }
    const nextPaymentStatus = normalizedAction === "approve" && (refundAmount >= Number(order.totalAmount ?? 0) - 0.005) ? "refunded" : order.paymentStatus;
    const refundDecisionAt = new Date().toISOString();
    const metadata = {
      ...(order.metadata || {}),
      lastUpdatedBy: actor.id || null,
      lastUpdatedAt: refundDecisionAt,
      refundDecision: normalizedAction === "approve" ? "approved" : "rejected",
      refundDecisionAt,
      refundAmount: Number.isFinite(refundAmount) && refundAmount > 0 ? refundAmount : Number(order.totalAmount ?? 0),
      refundType: isPartial ? "partial" : "full",
      refundCompletedAt: normalizedAction === "approve" ? refundDecisionAt : null,
      refundRequestedAt: order.metadata?.refundRequestedAt || order.refundRequestedAt || null,
      refundReason: normalizedReason || order.metadata?.refundReason || order.refundReason || null,
    };

    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
        paymentStatus: normalizedAction === "approve" ? nextPaymentStatus : order.paymentStatus,
        metadata,
      },
      include: {
        customer: true,
        shippingAddress: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    await applyInventoryForStatus(tx, order, nextStatus, actor.id || null);

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: nextStatus,
        paymentStatus: nextOrder.paymentStatus,
        actorType: actor.type || "admin",
        actorId: actor.id ? Number(actor.id) : null,
        note: payload.note || null,
      },
    });

    const note = await tx.orderNote.create({
      data: {
        orderId: order.id,
        authorType: actor.type || "admin",
        authorId: actor.id ? Number(actor.id) : null,
        note: payload.note || `Refund ${normalizedAction === "approve" ? "approved" : "rejected"}: ${normalizedReason || "No reason provided"}`,
        isInternal: true,
      },
    });

    await tx.auditLog.create({
      data: {
        adminId: actor.id ? Number(actor.id) : null,
        action: "update",
        entity: "Order",
        entityId: order.id,
        entityName: order.orderNumber,
        details: {
          action: `refund_${normalizedAction}`,
          reason: normalizedReason || null,
          amount: Number.isFinite(refundAmount) && refundAmount > 0 ? refundAmount : Number(order.totalAmount ?? 0),
          isPartial,
        },
      },
    });

    return { order: nextOrder, note };
  });

  return {
    ...toOrderPayload(updated.order),
    note: updated.note,
  };
};

export const updateOrderStatus = async (orderId, nextStatus, actor = {}) => {
  const { where } = buildOrderLookup(orderId);
  const order = await prisma.order.findFirst({ where, include: { customer: true } });
  if (!order) return null;

  const normalizedNext = normalizeStatus(nextStatus);
  const transition = resolveOrderTransition(order.status, normalizedNext);
  if (!transition.allowed) {
    throw Object.assign(new Error("Invalid order transition"), { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    // Re-fetch and lock the order row inside transaction to avoid concurrent
    // transitions applying inventory or history twice.
    const lockedOrderRows = await tx.$queryRaw`SELECT * FROM "Order" WHERE id = ${order.id} FOR UPDATE`;
    const lockedOrder = Array.isArray(lockedOrderRows) ? lockedOrderRows[0] : lockedOrderRows;

    if (!lockedOrder) throw new Error("Order not found during transition");

    // If the order already has the desired status, treat as idempotent and
    // return the current order without applying inventory or creating history.
    if ((lockedOrder.status || "").toLowerCase() === normalizedNext) {
      return lockedOrder;
    }

    await applyInventoryForStatus(tx, order, normalizedNext, actor.id || null);

    const updateData = {
      status: normalizedNext,
      paymentStatus: normalizedNext === "delivered" ? "paid" : order.paymentStatus,
      metadata: {
        ...(order.metadata || {}),
        lastUpdatedBy: actor.id || null,
        lastUpdatedAt: new Date().toISOString(),
      },
    };

    if (normalizedNext === "refund_requested") {
      updateData.metadata.refundRequestedAt = new Date().toISOString();
      updateData.metadata.refundReason = actor.reason || order.metadata?.refundReason || order.refundReason || null;
      updateData.metadata.refundDecision = "pending";
      updateData.metadata.refundCompletedAt = null;
    }

    if (normalizedNext === "refund_completed") {
      updateData.paymentStatus = "refunded";
      updateData.metadata.refundCompletedAt = new Date().toISOString();
      updateData.metadata.refundDecision = "approved";
    }

    const nextOrder = await tx.order.update({
      where: { id: order.id },
      data: updateData,
      include: {
        customer: true,
        shippingAddress: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: normalizedNext,
        paymentStatus: nextOrder.paymentStatus,
        actorType: actor.type || "admin",
        actorId: actor.id ? Number(actor.id) : null,
        note: actor.note || null,
      },
    });

    return nextOrder;
  });

  return toOrderPayload(updated);
};

export const updateOrderTracking = async (orderId, payload = {}) => {
  const parsedId = Number(orderId);
  const where = Number.isInteger(parsedId) ? { id: parsedId } : { orderNumber: String(orderId) };
  const order = await prisma.order.findFirst({ where });
  if (!order) return null;

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      trackingNumber: normalizeString(payload.trackingNumber) || null,
      shippingProvider: normalizeString(payload.shippingProvider) || null,
    },
    include: {
      customer: true,
      shippingAddress: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  return toOrderPayload(updated);
};

export const addOrderNote = async (orderId, payload = {}) => {
  const parsedId = Number(orderId);
  const where = Number.isInteger(parsedId) ? { id: parsedId } : { orderNumber: String(orderId) };
  const order = await prisma.order.findFirst({ where });
  if (!order) return null;

  const note = await prisma.orderNote.create({
    data: {
      orderId: order.id,
      authorType: payload.authorType || "admin",
      authorId: payload.authorId ? Number(payload.authorId) : null,
      note: payload.note || "",
      isInternal: Boolean(payload.isInternal),
    },
  });

  return note;
};

export const getOrderNotes = async (orderId) => {
  const parsedId = Number(orderId);
  const where = Number.isInteger(parsedId) ? { id: parsedId } : { orderNumber: String(orderId) };
  const order = await prisma.order.findFirst({ where });
  if (!order) return [];

  return prisma.orderNote.findMany({
    where: { orderId: order.id },
    orderBy: { createdAt: "desc" },
  });
};
