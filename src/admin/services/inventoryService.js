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

export const getInventory = async (params = {}) => {
  const response = await adminApi.get("/products", { params });
  return normalizeListResponse(response);
};

export const updateInventoryStock = async (productId, stock) => {
  const response = await adminApi.put(`/products/${productId}`, { stock });
  return response.data;
};

export const getInventoryProduct = async (productId) => {
  const response = await adminApi.get(`/products/${productId}`);
  return response.data;
};

export const createInventoryProduct = async (payload) => {
  const response = await adminApi.post("/products", payload);
  return response.data;
};

export const deleteInventoryProduct = async (productId) => {
  const response = await adminApi.delete(`/products/${productId}`);
  return response.data;
};
