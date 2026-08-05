import api from "./api";

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

  const payload = data?.data ?? data;
  const meta = data?.meta || {};

  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: meta.total ?? payload.length,
      page: meta.page ?? meta.currentPage ?? 1,
      pageSize: meta.pageSize ?? meta.limit ?? payload.length,
    };
  }

  if (payload && Array.isArray(payload.items)) {
    return {
      items: payload.items,
      total: payload.total ?? meta.total ?? payload.items.length,
      page: payload.page ?? meta.page ?? meta.currentPage ?? 1,
      pageSize: payload.pageSize ?? meta.pageSize ?? meta.limit ?? payload.items.length,
    };
  }

  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 0,
  };
};

export const fetchProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  const normalized = normalizeListResponse(response);
  return normalized.items;
};

export const fetchProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data?.data ?? response.data;
};

export const fetchRecommendedProducts = async (productId, params = {}) => {
  const response = await api.get(`/products/${productId}/recommended`, { params });
  const normalized = normalizeListResponse(response);
  return normalized.items;
};
