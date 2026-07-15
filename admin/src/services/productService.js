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

export const getProducts = async (params = {}) => {
  const response = await adminApi.get("/products", { params });
  return normalizeListResponse(response);
};

export const getProduct = async (productId) => {
  const response = await adminApi.get(`/products/${productId}`);
  return response.data;
};

const buildPayload = (product) => {
  if (product.images && product.images.some((item) => item instanceof File)) {
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (key === "images") {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append("images", file);
          }
        });
      } else if (key === "tags") {
        formData.append("tags", JSON.stringify(value));
      } else if (key === "existingImages") {
        formData.append("existingImages", JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    return formData;
  }

  return {
    ...product,
    tags: Array.isArray(product.tags) ? product.tags : [] ,
    existingImages: product.existingImages ?? [],
  };
};

export const createProduct = async (payload) => {
  const body = buildPayload(payload);
  const config = body instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
  const response = await adminApi.post("/products", body, config);
  return response.data;
};

export const updateProduct = async (productId, payload) => {
  const body = buildPayload(payload);
  const config = body instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
  const response = await adminApi.put(`/products/${productId}`, body, config);
  return response.data;
};

export const updateProductStock = async (productId, stock) => {
  const response = await adminApi.put(`/products/${productId}`, { stock });
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await adminApi.delete(`/products/${productId}`);
  return response.data;
};
