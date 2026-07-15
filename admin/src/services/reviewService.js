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

export const getReviews = async (params = {}) => {
  const response = await adminApi.get("/reviews", { params });
  return normalizeListResponse(response);
};

export const getReview = async (reviewId) => {
  const response = await adminApi.get(`/reviews/${reviewId}`);
  return response.data;
};

export const updateReviewStatus = async (reviewId, status) => {
  const response = await adminApi.put(`/reviews/${reviewId}/status`, { status });
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await adminApi.delete(`/reviews/${reviewId}`);
  return response.data;
};
