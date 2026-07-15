import prisma from "../../database/prismaClient.js";

const getStartOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setMinutes(0, 0, 0, 0);
  return now;
};

const getStartOfMonth = () => {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  now.setMinutes(0, 0, 0, 0);
  return now;
};

const getStartOfPreviousMonth = () => {
  const now = new Date();
  now.setDate(1);
  now.setMonth(now.getMonth() - 1);
  now.setHours(0, 0, 0, 0);
  now.setMinutes(0, 0, 0, 0);
  return now;
};

const formatCustomerName = (customer) => {
  if (!customer) return null;
  if (customer.fullName) return customer.fullName;

  const firstName = customer.firstName?.trim();
  const lastName = customer.lastName?.trim();

  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ");
  }

  return customer.email || null;
};

const buildOrderStatusBreakdown = (counts) => [
  { status: "pending", count: counts.pending },
  { status: "processing", count: counts.processing },
  { status: "shipped", count: counts.shipped },
  { status: "delivered", count: counts.delivered },
  { status: "cancelled", count: counts.cancelled },
  { status: "refunded", count: counts.refunded },
];

const buildCustomerBreakdown = (counts) => ({
  active: counts.active,
  blocked: counts.blocked,
  newCustomers: counts.newCustomers,
  repeatCustomers: counts.repeatCustomers,
});

const buildRevenueSeries = (orders) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1, 0, 0, 0, 0);
    return { monthDate, label: monthDate.toLocaleString("default", { month: "short" }), total: 0 };
  });

  for (const order of orders) {
    if (!order.placedAt) continue;
    const placedAt = new Date(order.placedAt);
    const monthIndex = months.findIndex(
      (month) => month.monthDate.getFullYear() === placedAt.getFullYear() && month.monthDate.getMonth() === placedAt.getMonth()
    );

    if (monthIndex >= 0) {
      months[monthIndex].total += order.totalAmount ?? 0;
    }
  }

  return months.map((month) => ({ month: month.label, value: month.total }));
};

const buildTopProducts = (orders) => {
  const productMap = new Map();

  for (const order of orders) {
    const items = Array.isArray(order.items) ? order.items : [];
    for (const item of items) {
      const name = String(item?.name || item?.title || item?.productName || "Untitled product").trim();
      const quantity = Number(item?.quantity ?? item?.qty ?? 0);
      if (!name || quantity <= 0) continue;

      const existing = productMap.get(name) || { name, quantity: 0 };
      existing.quantity += quantity;
      productMap.set(name, existing);
    }
  }

  return Array.from(productMap.values())
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, 5);
};

export const getDashboardSummary = async () => {
  console.info("[dashboardService] Generating dashboard summary metrics");

  const today = getStartOfToday();
  const monthStart = getStartOfMonth();
  const previousMonthStart = getStartOfPreviousMonth();

  const [
    totalProducts,
    totalCategories,
    totalBrands,
    totalCustomers,
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    refundedOrders,
    revenueResult,
    todayRevenueResult,
    monthlyRevenueResult,
    lowStockCount,
    outOfStockCount,
    recentOrdersRaw,
    recentCustomers,
    recentOrdersForSeries,
    allCustomersForBreakdown,
    allOrdersForTopProducts,
    lowStockProducts,
    outOfStockProducts,
  ] = await prisma.$transaction([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.category.count({ where: { deletedAt: null } }),
    prisma.brand.count({ where: { deletedAt: null } }),
    prisma.customer.count({ where: { deletedAt: null } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "processing" } }),
    prisma.order.count({ where: { status: "shipped" } }),
    prisma.order.count({ where: { status: "delivered" } }),
    prisma.order.count({ where: { status: "cancelled" } }),
    prisma.order.count({ where: { status: "refunded" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { placedAt: { gte: today } } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { placedAt: { gte: monthStart } } }),
    prisma.product.count({ where: { deletedAt: null, stock: { gt: 0, lte: 10 } } }),
    prisma.product.count({ where: { deletedAt: null, stock: 0 } }),
    prisma.order.findMany({
      orderBy: { placedAt: "desc" },
      take: 5,
      include: { customer: true, payment: true },
    }),
    prisma.customer.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.findMany({
      where: { placedAt: { gte: previousMonthStart } },
      select: { placedAt: true, totalAmount: true },
    }),
    prisma.customer.findMany({
      where: { deletedAt: null },
      select: { status: true, _count: { select: { orders: true } } },
    }),
    prisma.order.findMany({ select: { items: true } }),
    prisma.product.findMany({
      where: { deletedAt: null, stock: { gt: 0, lte: 10 } },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, stock: true, price: true, slug: true },
    }),
    prisma.product.findMany({
      where: { deletedAt: null, stock: 0 },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, name: true, stock: true, price: true, slug: true },
    }),
  ]);

  const revenue = Number(revenueResult._sum.totalAmount ?? 0);
  const todayRevenue = Number(todayRevenueResult._sum.totalAmount ?? 0);
  const monthlyRevenue = Number(monthlyRevenueResult._sum.totalAmount ?? 0);

  const completedOrders = deliveredOrders;
  const refundRequests = refundedOrders;
  const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;
  const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0;

  const previousMonthRevenueResult = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: {
      placedAt: {
        gte: previousMonthStart,
        lt: monthStart,
      },
    },
  });

  const previousMonthRevenue = Number(previousMonthRevenueResult._sum.totalAmount ?? 0);
  const growthPercentage = previousMonthRevenue > 0 ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0;

  const orderStatusBreakdown = buildOrderStatusBreakdown({
    pending: pendingOrders,
    processing: processingOrders,
    shipped: shippedOrders,
    delivered: deliveredOrders,
    cancelled: cancelledOrders,
    refunded: refundedOrders,
  });

  const customerCounts = allCustomersForBreakdown.reduce(
    (acc, customer) => {
      const status = String(customer.status || "active").toLowerCase();
      if (status === "blocked") {
        acc.blocked += 1;
      } else {
        acc.active += 1;
      }

      if (customer._count.orders <= 1) {
        acc.newCustomers += 1;
      } else {
        acc.repeatCustomers += 1;
      }

      return acc;
    },
    { active: 0, blocked: 0, newCustomers: 0, repeatCustomers: 0 }
  );

  const recentOrders = recentOrdersRaw.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    orderStatus: order.status,
    totalAmount: order.totalAmount,
    paymentStatus: order.payment?.status ?? null,
    paymentMethod: order.payment?.method ?? null,
    customerName: formatCustomerName(order.customer),
    customerEmail: order.customer?.email ?? null,
    createdAt: order.placedAt?.toISOString(),
    updatedAt: order.updatedAt?.toISOString(),
  }));

  const recentCustomersList = recentCustomers.map((customer) => ({
    id: customer.id,
    name: formatCustomerName(customer),
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    registeredAt: customer.createdAt?.toISOString(),
  }));

  const revenueSeries = buildRevenueSeries(recentOrdersForSeries);
  const topProducts = buildTopProducts(allOrdersForTopProducts);

  const recentActivities = [
    ...recentOrders.map((order) => ({
      id: `order-${order.id}`,
      title: `Order ${order.orderNumber} updated`,
      detail: `${order.customerName || "Customer"} • ${order.orderStatus || "pending"}`,
      createdAt: order.createdAt,
    })),
    ...recentCustomersList.slice(0, 2).map((customer) => ({
      id: `customer-${customer.id}`,
      title: "New customer registered",
      detail: customer.name || customer.email || "Customer",
      createdAt: customer.registeredAt,
    })),
  ]
    .filter((activity) => activity.createdAt)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 6);

  return {
    totalProducts,
    totalCategories,
    totalBrands,
    totalCustomers,
    totalOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue: revenue,
    revenue,
    todayRevenue,
    monthlyRevenue,
    completedOrders,
    refundRequests,
    averageOrderValue,
    conversionRate,
    growthPercentage,
    lowStockCount,
    outOfStockCount,
    lowStockProducts,
    outOfStockProducts,
    recentOrders,
    recentCustomers: recentCustomersList,
    orderStatusBreakdown,
    customerBreakdown: buildCustomerBreakdown(customerCounts),
    topProducts,
    revenueSeries,
    recentActivities,
  };
};
