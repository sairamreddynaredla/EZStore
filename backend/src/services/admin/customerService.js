import prisma from "../../database/prismaClient.js";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const buildCustomerName = (customer) => {
  if (!customer) return null;
  if (customer.fullName) return customer.fullName;

  const firstName = normalizeString(customer.firstName);
  const lastName = normalizeString(customer.lastName);

  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ");
  }

  return normalizeString(customer.email) || null;
};

const buildCustomerSummary = (customer) => {
  if (!customer) return null;

  const totalOrders = Array.isArray(customer.orders) ? customer.orders.length : 0;
  const totalSpent = customer.orders?.reduce((sum, order) => sum + Number(order?.totalAmount ?? 0), 0) ?? 0;
  const wishlistCount = Array.isArray(customer.wishlistItems) ? customer.wishlistItems.length : 0;
  const lastLoginAt = customer.lastLoginAt ?? null;

  return {
    id: customer.id,
    name: buildCustomerName(customer),
    email: customer.email,
    phone: customer.phone ?? null,
    status: customer.status ?? "active",
    totalOrders,
    totalSpent,
    wishlistCount,
    registeredAt: customer.createdAt,
    lastLoginAt,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
    orders: Array.isArray(customer.orders) ? customer.orders.map((order) => ({
      id: order.id,
      orderId: order.orderId ?? order.id,
      totalAmount: Number(order.totalAmount ?? 0),
      status: order.status ?? null,
      placedAt: order.placedAt ?? order.createdAt ?? null,
    })) : [],
    addresses: Array.isArray(customer.addresses) ? customer.addresses : [],
  };
};

const buildCustomerWhere = (query = {}) => {
  const where = { deletedAt: null };
  const search = normalizeString(query.q);
  const status = normalizeString(query.status);

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { fullName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
};

const getOrderBy = (sortBy, order = "asc") => {
  const direction = order === "desc" ? "desc" : "asc";
  switch (sortBy) {
    case "totalOrders":
      return { createdAt: direction };
    case "totalSpent":
      return { createdAt: direction };
    case "registeredAt":
      return { createdAt: direction };
    case "name":
      return { fullName: direction };
    case "email":
      return { email: direction };
    default:
      return { createdAt: direction };
  }
};

export const getCustomers = async (query = {}) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit >= 0 ? limit : 10;
  const skip = safeLimit === 0 ? 0 : Math.max(0, (safePage - 1) * safeLimit);
  const where = buildCustomerWhere(query);
  const orderBy = getOrderBy(query.sortBy, query.order);

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy,
      skip: safeLimit === 0 ? undefined : skip,
      take: safeLimit === 0 ? undefined : Math.max(1, safeLimit),
      include: {
        addresses: true,
        orders: {
          select: { id: true, orderNumber: true, totalAmount: true, status: true, placedAt: true },
        },
        wishlistItems: true,
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    items: items.map(buildCustomerSummary),
    total,
    page: safePage,
    pageSize: safeLimit === 0 ? total : Math.max(1, safeLimit),
  };
};

export const getCustomer = async (customerId) => {
  const parsedId = Number(customerId);
  const where = Number.isInteger(parsedId) ? { id: parsedId } : { id: Number(customerId) };

  const customer = await prisma.customer.findFirst({
    where: { ...where, deletedAt: null },
    include: {
      addresses: true,
      orders: {
        orderBy: { placedAt: "desc" },
        select: { id: true, orderNumber: true, totalAmount: true, status: true, placedAt: true },
      },
      wishlistItems: {
        include: { product: { select: { id: true, name: true, price: true, imageUrl: true } } },
      },
    },
  });

  return buildCustomerSummary(customer);
};

export const updateCustomerStatus = async (customerId, status) => {
  const parsedId = Number(customerId);
  const existing = await prisma.customer.findFirst({ where: { id: parsedId, deletedAt: null } });
  if (!existing) return null;

  const normalizedStatus = normalizeString(status) || existing.status || "active";
  const updated = await prisma.customer.update({
    where: { id: existing.id },
    data: { status: normalizedStatus },
  });

  return {
    id: updated.id,
    status: updated.status,
    email: updated.email,
  };
};
