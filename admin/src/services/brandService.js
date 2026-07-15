import adminApi from "./api.js";

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

const buildPayload = (brand) => ({
  ...brand,
  name: brand?.name?.trim() ?? "",
  slug: brand?.slug?.trim() ?? "",
  description: brand?.description?.trim() ?? "",
  status: brand?.status ?? "active",
});

export const getBrands = async (params = {}) => {
  const response = await adminApi.get("/brands", { params });
  return normalizeListResponse(response);
};

export const getBrand = async (brandId) => {
  const response = await adminApi.get(`/brands/${brandId}`);
  return response.data;
};

export const createBrand = async (payload) => {
  const response = await adminApi.post("/brands", buildPayload(payload));
  return response.data;
};

export const updateBrand = async (brandId, payload) => {
  const response = await adminApi.put(`/brands/${brandId}`, buildPayload(payload));
  return response.data;
};

export const deleteBrand = async (brandId) => {
  const response = await adminApi.delete(`/brands/${brandId}`);
  return response.data;
};
