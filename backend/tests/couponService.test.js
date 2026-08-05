import test from "node:test";
import assert from "node:assert/strict";
import couponService from "../src/services/shared/couponService.js";
import prisma from "../src/database/prismaClient.js";

// Helper to restore mocked prisma methods after each test
const original = {
  couponFindUnique: prisma.coupon?.findUnique,
  couponUsageCount: prisma.couponUsage?.count,
  orderCount: prisma.order?.count,
};

function restore() {
  if (original.couponFindUnique) prisma.coupon.findUnique = original.couponFindUnique;
  if (original.couponUsageCount && prisma.couponUsage) prisma.couponUsage.count = original.couponUsageCount;
  if (original.orderCount) prisma.order.count = original.orderCount;
}

test("valid percentage coupon computes discount", async () => {
  prisma.coupon.findUnique = async ({ where }) => ({ id: 1, code: where.code, discountType: "percent", discount: 10, status: "active", usageLimit: null, usageCount: 0, perUserLimit: null, minOrderAmount: 0, maxDiscount: null, startsAt: null, expiresAt: null });
  prisma.couponUsage.count = async () => 0;
  prisma.order.count = async () => 0;

  const { coupon, discountAmount } = await couponService.validateAndComputeCoupon({ code: "SAVE10", subtotal: 200, customerId: 123, items: [] });
  assert.equal(coupon.code, "SAVE10");
  assert.equal(discountAmount, 20);
  restore();
});

test("valid fixed coupon computes discount", async () => {
  prisma.coupon.findUnique = async ({ where }) => ({ id: 2, code: where.code, discountType: "fixed", discount: 15, status: "active", usageLimit: null, usageCount: 0, perUserLimit: null, minOrderAmount: 0, maxDiscount: null, startsAt: null, expiresAt: null });
  prisma.couponUsage.count = async () => 0;
  prisma.order.count = async () => 0;

  const { discountAmount } = await couponService.validateAndComputeCoupon({ code: "FLAT15", subtotal: 200, customerId: null, items: [] });
  assert.equal(discountAmount, 15);
  restore();
});

test("expired coupon throws", async () => {
  const past = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2); // 2 days ago
  prisma.coupon.findUnique = async ({ where }) => ({ id: 3, code: where.code, discountType: "percent", discount: 5, status: "active", startsAt: null, expiresAt: past });

  try {
    await couponService.validateAndComputeCoupon({ code: "OLD", subtotal: 100 });
    assert.fail("Expected expired coupon to throw");
  } catch (err) {
    assert.equal(err.message, "Coupon expired");
  }
  restore();
});

test("future coupon throws not yet valid", async () => {
  const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
  prisma.coupon.findUnique = async ({ where }) => ({ id: 4, code: where.code, discountType: "percent", discount: 5, status: "active", startsAt: future, expiresAt: null });

  try {
    await couponService.validateAndComputeCoupon({ code: "FUTURE", subtotal: 100 });
    assert.fail("Expected future coupon to throw");
  } catch (err) {
    assert.equal(err.message, "Coupon not yet valid");
  }
  restore();
});

test("disabled coupon throws", async () => {
  prisma.coupon.findUnique = async ({ where }) => ({ id: 5, code: where.code, discountType: "percent", discount: 5, status: "inactive", startsAt: null, expiresAt: null });

  try {
    await couponService.validateAndComputeCoupon({ code: "OFF", subtotal: 100 });
    assert.fail("Expected inactive coupon to throw");
  } catch (err) {
    assert.equal(err.message, "Coupon inactive");
  }
  restore();
});

test("max discount caps percentage discount", async () => {
  prisma.coupon.findUnique = async ({ where }) => ({ id: 6, code: where.code, discountType: "percent", discount: 50, status: "active", maxDiscount: 20, startsAt: null, expiresAt: null });
  prisma.couponUsage.count = async () => 0;
  prisma.order.count = async () => 0;

  const { discountAmount } = await couponService.validateAndComputeCoupon({ code: "HALF", subtotal: 100 });
  assert.equal(discountAmount, 20);
  restore();
});

test("minimum order amount enforcement", async () => {
  prisma.coupon.findUnique = async ({ where }) => ({ id: 7, code: where.code, discountType: "fixed", discount: 30, status: "active", minOrderAmount: 200, startsAt: null, expiresAt: null });

  try {
    await couponService.validateAndComputeCoupon({ code: "MIN200", subtotal: 50 });
    assert.fail("Expected min order amount to throw");
  } catch (err) {
    assert.equal(err.message, "Minimum order amount not met");
  }
  restore();
});

test("usage limit enforcement", async () => {
  prisma.coupon.findUnique = async ({ where }) => ({ id: 8, code: where.code, discountType: "fixed", discount: 10, status: "active", usageLimit: 5, usageCount: 5, startsAt: null, expiresAt: null });

  try {
    await couponService.validateAndComputeCoupon({ code: "LIMITED", subtotal: 100 });
    assert.fail("Expected usage limit exceeded");
  } catch (err) {
    assert.equal(err.message, "Usage limit exceeded");
  }
  restore();
});

test("per-user usage limit enforcement", async () => {
  prisma.coupon.findUnique = async ({ where }) => ({ id: 9, code: where.code, discountType: "fixed", discount: 10, status: "active", perUserLimit: 1, startsAt: null, expiresAt: null });
  prisma.couponUsage.count = async () => 1;

  try {
    await couponService.validateAndComputeCoupon({ code: "ONEPER", subtotal: 100, customerId: 42 });
    assert.fail("Expected per-user limit to throw");
  } catch (err) {
    assert.equal(err.message, "Coupon already used by this customer");
  }
  restore();
});

test("first-order-only enforcement", async () => {
  prisma.coupon.findUnique = async ({ where }) => ({ id: 10, code: where.code, discountType: "fixed", discount: 10, status: "active", firstOrderOnly: true, startsAt: null, expiresAt: null });
  prisma.order.count = async () => 2;

  try {
    await couponService.validateAndComputeCoupon({ code: "FIRST", subtotal: 100, customerId: 99 });
    assert.fail("Expected first-order-only to throw");
  } catch (err) {
    assert.equal(err.message, "Coupon only valid for first order");
  }
  restore();
});

test("product inclusion/exclusion checks", async () => {
  prisma.coupon.findUnique = async ({ where }) => ({ id: 11, code: where.code, discountType: "fixed", discount: 5, status: "active", applicableProducts: [1, 2], excludedProducts: [3], startsAt: null, expiresAt: null });
  prisma.couponUsage.count = async () => 0;
  prisma.order.count = async () => 0;

  // items with productId 4 should fail inclusion
  try {
    await couponService.validateAndComputeCoupon({ code: "INCL", subtotal: 50, items: [{ productId: 4 }] });
    assert.fail("Expected not applicable to selected products");
  } catch (err) {
    assert.equal(err.message, "Coupon not applicable to selected products");
  }

  // items with excluded product should fail
  try {
    await couponService.validateAndComputeCoupon({ code: "INCL", subtotal: 50, items: [{ productId: 3 }] });
    assert.fail("Expected coupon not applicable to selected products due to exclusion");
  } catch (err) {
    assert.equal(err.message, "Coupon not applicable to selected products");
  }

  // item with allowed product should pass
  const { discountAmount } = await couponService.validateAndComputeCoupon({ code: "INCL", subtotal: 50, items: [{ productId: 2 }] });
  assert.equal(discountAmount, 5);
  restore();
});

// Restore any original methods at the end
restore();
