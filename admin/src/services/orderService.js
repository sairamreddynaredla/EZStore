import adminApi from "./api";

const normalizeListResponse = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: 1,
      pageSize: data.length,
    };
  }

  if (data && Array.isArray(data.data)) {
    const meta = data.meta || data.pagination || {};
    return {
      items: data.data,
      total: meta.total ?? data.data.length,
      page: meta.page ?? meta.currentPage ?? 1,
      pageSize: meta.pageSize ?? meta.limit ?? data.data.length,
    };
  }

  if (data && Array.isArray(data.items)) {
    const meta = data.meta || data.pagination || {};
    return {
      items: data.items,
      total: meta.total ?? data.total ?? data.items.length,
      page: meta.page ?? meta.currentPage ?? 1,
      pageSize: meta.pageSize ?? meta.limit ?? data.items.length,
    };
  }

  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 0,
  };
};

export const getOrders = async (params = {}) => {
  const response = await adminApi.get("/orders", { params });
  return normalizeListResponse(response);
};

export const getOrder = async (orderId) => {
  const response = await adminApi.get(`/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await adminApi.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

export const updateOrderTracking = async (orderId, payload = {}) => {
  const response = await adminApi.put(`/orders/${orderId}/tracking`, payload);
  return response.data;
};

export const addOrderNote = async (orderId, payload = {}) => {
  const response = await adminApi.post(`/orders/${orderId}/notes`, payload);
  return response.data;
};

export const createRefundRequest = async (orderId, payload = {}) => {
  const response = await adminApi.post(`/orders/${orderId}/refunds`, payload);
  return response.data;
};

export const resolveRefundRequest = async (orderId, payload = {}) => {
  const response = await adminApi.post(`/orders/${orderId}/refunds/resolve`, payload);
  return response.data;
};
