import adminApi from "./api";
import { getProducts } from "./productService";
import { getOrders } from "./orderService";
import { getCustomers } from "./customerService";
import { getCategories } from "./categoryService";

const safeValue = (value, fallback = 0) => (typeof value === "number" ? value : fallback);

const normalizeListResponse = (responseData) => {
  if (Array.isArray(responseData)) {
    return {
      items: responseData,
      total: responseData.length,
      page: 1,
      pageSize: responseData.length,
    };
  }

  if (responseData && Array.isArray(responseData.data)) {
    const meta = responseData.meta || responseData.pagination || {};
    return {
      items: responseData.data,
      total: meta.total ?? responseData.data.length,
      page: meta.page ?? meta.currentPage ?? 1,
      pageSize: meta.pageSize ?? meta.limit ?? responseData.data.length,
      revenue: responseData.meta?.totalRevenue ?? responseData.meta?.revenue ?? responseData.totalRevenue ?? responseData.revenue,
    };
  }

  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 0,
  };
};

const getFallbackDashboardSummary = async () => {
  const [productsResult, categoriesResult, customersResult, ordersResult, recentOrdersResult, pendingOrdersResult] = await Promise.allSettled([
    getProducts({ page: 1, limit: 100, sortBy: "stock", order: "asc" }),
    getCategories({ page: 1, limit: 100 }),
    getCustomers({ page: 1, limit: 5, sortBy: "registeredAt", order: "desc" }),
    getOrders({ page: 1, limit: 1 }),
    getOrders({ page: 1, limit: 5, sortBy: "orderDate", order: "desc" }),
    getOrders({ page: 1, limit: 1, status: "pending" }),
  ]);

  const products = productsResult.status === "fulfilled" ? productsResult.value : { items: [], total: 0 };
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : { items: [], total: 0 };
  const customers = customersResult.status === "fulfilled" ? customersResult.value : { items: [], total: 0 };
  const orders = ordersResult.status === "fulfilled" ? ordersResult.value : { items: [], total: 0 };
  const recentOrders = recentOrdersResult.status === "fulfilled" ? recentOrdersResult.value.items : [];
  const pendingOrders = pendingOrdersResult.status === "fulfilled" ? pendingOrdersResult.value.total : 0;

  const lowStockProducts = (products.items || [])
    .filter((item) => typeof item.stock === "number" && item.stock > 0 && item.stock <= 10)
    .slice(0, 10);
  const outOfStockProducts = (products.items || [])
    .filter((item) => typeof item.stock === "number" && item.stock <= 0)
    .slice(0, 10);

  return {
    totalProducts: safeValue(products.total, 0),
    totalCategories: safeValue(categories.total, 0),
    totalCustomers: safeValue(customers.total, 0),
    totalOrders: safeValue(orders.total, 0),
    revenue: ordersResult.status === "fulfilled" ? ordersResult.value.revenue ?? null : null,
    pendingOrders: safeValue(pendingOrders, 0),
    lowStockCount: lowStockProducts.length,
    outOfStockCount: outOfStockProducts.length,
    lowStockProducts,
    outOfStockProducts,
    recentOrders,
    recentCustomers: customers.items || [],
  };
};

export const getDashboardSummary = async () => {
  try {
    const response = await adminApi.get("/dashboard/summary");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 501) {
      return getFallbackDashboardSummary();
    }

    throw error;
  }
};
