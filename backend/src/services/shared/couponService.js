import prisma from "../../database/prismaClient.js";

const normalizeCode = (code) => (typeof code === "string" ? code.trim().toUpperCase() : "");

class CouponError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

// Validate coupon and compute discount amount for a given subtotal and items
export const validateAndComputeCoupon = async ({ code, customerId = null, subtotal = 0, items = [] }) => {
  const normalized = normalizeCode(code);
  if (!normalized) throw new CouponError("Invalid coupon", 400);

  const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });
  if (!coupon) throw new CouponError("Coupon not found", 404);

  if (String(coupon.status).toLowerCase() !== "active") throw new CouponError("Coupon inactive", 400);

  const now = new Date();
  if (coupon.startsAt && new Date(coupon.startsAt) > now) throw new CouponError("Coupon not yet valid", 400);
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) throw new CouponError("Coupon expired", 400);

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new CouponError("Usage limit exceeded", 400);

  // Per-user limit
  if (customerId && coupon.perUserLimit) {
    const used = await prisma.couponUsage.count({ where: { couponId: coupon.id, customerId: Number(customerId) } });
    if (used >= coupon.perUserLimit) throw new CouponError("Coupon already used by this customer", 400);
  }

  if (coupon.minOrderAmount && Number(subtotal) < Number(coupon.minOrderAmount)) throw new CouponError("Minimum order amount not met", 400);

  // product/category applicability checks (if defined) — items are array with productId or productSlug
  const itemsProductIds = items.map((it) => Number(it.productId ?? it.id)).filter(Boolean);

  // If applicableProducts specified, ensure at least one item matches
  if (coupon.applicableProducts && Array.isArray(coupon.applicableProducts) && coupon.applicableProducts.length) {
    const allowed = coupon.applicableProducts.map(String);
    const match = itemsProductIds.some((pid) => allowed.includes(String(pid)));
    if (!match) throw new CouponError("Coupon not applicable to selected products", 400);
  }

  // Excluded products
  if (coupon.excludedProducts && Array.isArray(coupon.excludedProducts) && coupon.excludedProducts.length) {
    const excluded = coupon.excludedProducts.map(String);
    const forbidden = itemsProductIds.some((pid) => excluded.includes(String(pid)));
    if (forbidden) throw new CouponError("Coupon not applicable to selected products", 400);
  }

  // first order only
  if (coupon.firstOrderOnly && customerId) {
    const previous = await prisma.order.count({ where: { customerId: Number(customerId) } });
    if (previous > 0) throw new CouponError("Coupon only valid for first order", 400);
  }

  // compute discount
  let discountAmount = 0;
  if (String(coupon.discountType) === "percent") {
    discountAmount = (Number(subtotal) * Number(coupon.discount || 0)) / 100.0;
  } else {
    discountAmount = Number(coupon.discount || 0);
  }

  if (coupon.maxDiscount && Number(coupon.maxDiscount) > 0) {
    discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
  }

  discountAmount = Math.round((discountAmount || 0) * 100) / 100;

  return { coupon, discountAmount };
};

export default { validateAndComputeCoupon, CouponError };
