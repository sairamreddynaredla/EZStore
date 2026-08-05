import prisma from "../../database/prismaClient.js";

const toCouponData = (payload = {}) => ({
  ...(payload.code !== undefined ? { code: String(payload.code).trim().toUpperCase() } : {}),
  ...(payload.description !== undefined ? { description: String(payload.description).trim() || null } : {}),
  ...(payload.discountType !== undefined ? { discountType: payload.discountType } : {}),
  ...(payload.discount !== undefined ? { discount: Number(payload.discount) } : {}),
  ...(payload.status !== undefined ? { status: payload.status } : {}),
  ...(payload.usageLimit !== undefined ? { usageLimit: payload.usageLimit === null ? null : Number(payload.usageLimit) } : {}),
  ...(payload.freeShipping !== undefined ? { freeShipping: Boolean(payload.freeShipping) } : {}),
  ...(payload.expiresAt !== undefined
    ? { expiresAt: payload.expiresAt ? new Date(`${payload.expiresAt}T23:59:59.999Z`) : null }
    : {}),
});

export const getCoupons = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.max(1, Number(query.limit) || 10);
  const q = String(query.q || "").trim();
  const where = {
    deletedAt: null,
    ...(query.status ? { status: query.status } : {}),
    ...(q
      ? { OR: [{ code: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }
      : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.coupon.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.coupon.count({ where }),
  ]);
  return { items, total, page, pageSize };
};

export const getCoupon = (couponId) => prisma.coupon.findFirst({ where: { id: Number(couponId), deletedAt: null } });

export const createCoupon = async (payload) => {
  const data = toCouponData(payload);
  const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
  if (existing) throw Object.assign(new Error("A coupon with this code already exists"), { status: 409 });
  return prisma.coupon.create({ data });
};

export const updateCoupon = async (couponId, payload) => {
  const existing = await getCoupon(couponId);
  if (!existing) return null;
  return prisma.coupon.update({ where: { id: existing.id }, data: toCouponData(payload) });
};

export const deleteCoupon = async (couponId) => {
  const existing = await getCoupon(couponId);
  if (!existing) return null;
  return prisma.coupon.update({ where: { id: existing.id }, data: { deletedAt: new Date(), status: "inactive" } });
};
