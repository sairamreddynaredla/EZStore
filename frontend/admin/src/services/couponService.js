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

  const meta = data?.meta || data?.pagination || {};

  if (data && Array.isArray(data.data)) {
    return {
      items: data.data,
      total: meta.total ?? data.data.length,
      page: data.page ?? meta.page ?? meta.currentPage ?? 1,
      pageSize: data.pageSize ?? meta.pageSize ?? meta.limit ?? data.data.length,
    };
  }

  if (data && Array.isArray(data.items)) {
    return {
      items: data.items,
      total: meta.total ?? data.total ?? data.items.length,
      page: data.page ?? meta.page ?? meta.currentPage ?? 1,
      pageSize: data.pageSize ?? meta.pageSize ?? meta.limit ?? data.items.length,
    };
  }

  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 0,
  };
};

const buildPayload = (coupon) => {
  const payload = {
    code: coupon.code?.trim(),
    description: coupon.description?.trim(),
    discount: Number(coupon.discount) || 0,
    // The checkout API uses percent/fixed; older admin UI values are mapped
    // here too so existing edit forms remain valid.
    discountType: coupon.discountType === "percentage" ? "percent" : coupon.discountType === "amount" ? "fixed" : coupon.discountType,
    freeShipping: !!coupon.shippingDiscount,
    usageLimit: coupon.usageLimit ? Number(coupon.usageLimit) : undefined,
    expiresAt: coupon.expiresAt || "",
    status: coupon.status,
  };

  if (payload.usageLimit === undefined) {
    delete payload.usageLimit;
  }

  return payload;
};

export const getCoupons = async (params = {}) => {
  const response = await adminApi.get("/coupons", { params });
  return normalizeListResponse(response);
};

export const getCoupon = async (couponId) => {
  const response = await adminApi.get(`/coupons/${couponId}`);
  return response.data;
};

export const createCoupon = async (payload) => {
  const body = buildPayload(payload);
  const response = await adminApi.post("/coupons", body);
  return response.data;
};

export const updateCoupon = async (couponId, payload) => {
  const body = buildPayload(payload);
  const response = await adminApi.put(`/coupons/${couponId}`, body);
  return response.data;
};

export const deleteCoupon = async (couponId) => {
  const response = await adminApi.delete(`/coupons/${couponId}`);
  return response.data;
};
