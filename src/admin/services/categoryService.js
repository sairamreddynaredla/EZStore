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

const buildPayload = (category) => {
  if (category.bannerFile instanceof File) {
    const formData = new FormData();

    Object.entries(category).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (key === "bannerFile") {
        formData.append("banner", value);
      } else if (key === "tags") {
        formData.append("tags", JSON.stringify(value));
      } else if (key === "existingBanner") {
        formData.append("existingBanner", value);
      } else {
        formData.append(key, String(value));
      }
    });

    return formData;
  }

  return {
    ...category,
    tags: Array.isArray(category.tags) ? category.tags : [],
  };
};

export const getCategories = async (params = {}) => {
  const response = await adminApi.get("/categories", { params });
  return normalizeListResponse(response);
};

export const getCategory = async (categoryId) => {
  const response = await adminApi.get(`/categories/${categoryId}`);
  return response.data;
};

export const createCategory = async (payload) => {
  const body = buildPayload(payload);
  const config = body instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
  const response = await adminApi.post("/categories", body, config);
  return response.data;
};

export const updateCategory = async (categoryId, payload) => {
  const body = buildPayload(payload);
  const config = body instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
  const response = await adminApi.put(`/categories/${categoryId}`, body, config);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await adminApi.delete(`/categories/${categoryId}`);
  return response.data;
};
