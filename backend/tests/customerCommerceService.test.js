import test from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/database/prismaClient.js";
import { upsertCartItem, toggleWishlistItem, createReview } from "../src/services/user/customerCommerceService.js";

test("upsertCartItem increments quantity for existing items", async (t) => {
  const originalFindFirst = prisma.cartItem.findFirst;
  const originalCreate = prisma.cartItem.create;
  const originalUpdate = prisma.cartItem.update;
  const originalProductFindUnique = prisma.product.findUnique;

  t.after(() => {
    prisma.cartItem.findFirst = originalFindFirst;
    prisma.cartItem.create = originalCreate;
    prisma.cartItem.update = originalUpdate;
    prisma.product.findUnique = originalProductFindUnique;
  });

  prisma.cartItem.findFirst = async () => ({ id: 11, quantity: 2, unitPrice: 25 });
  prisma.cartItem.create = async () => ({ id: 11, quantity: 2, unitPrice: 25 });
  prisma.cartItem.update = async ({ where, data }) => ({ id: where.id, quantity: data.quantity, unitPrice: 25 });
  prisma.product.findUnique = async () => ({ id: 21 });

  const result = await upsertCartItem(7, {
    productId: 21,
    productName: "Treats",
    unitPrice: 25,
    quantity: 1,
    selectedVariant: { weight: "500g" },
  });

  assert.equal(result.quantity, 3);
  assert.equal(result.unitPrice, 25);
});

test("toggleWishlistItem removes an existing item when toggled again", async (t) => {
  const originalFindMany = prisma.wishlistItem.findMany;
  const originalDeleteMany = prisma.wishlistItem.deleteMany;
  const originalCreate = prisma.wishlistItem.create;
  const originalProductFindUnique = prisma.product.findUnique;

  t.after(() => {
    prisma.wishlistItem.findMany = originalFindMany;
    prisma.wishlistItem.deleteMany = originalDeleteMany;
    prisma.wishlistItem.create = originalCreate;
    prisma.product.findUnique = originalProductFindUnique;
  });

  prisma.product.findUnique = async () => ({ id: 44 });
  prisma.wishlistItem.findMany = async () => [{ id: 99, productId: 44 }];
  prisma.wishlistItem.deleteMany = async () => ({ count: 1 });
  prisma.wishlistItem.create = async () => ({ id: 100, productId: 44 });

  const result = await toggleWishlistItem(8, { productId: 44, productName: "Bed", unitPrice: 60 });

  assert.equal(result.action, "removed");
  assert.deepEqual(result.itemIds, [99]);
});

test("toggleWishlistItem resolves a slug when productId is missing", async (t) => {
  const originalProductFindUnique = prisma.product.findUnique;
  const originalFindMany = prisma.wishlistItem.findMany;
  const originalDeleteMany = prisma.wishlistItem.deleteMany;
  const originalCreate = prisma.wishlistItem.create;

  t.after(() => {
    prisma.product.findUnique = originalProductFindUnique;
    prisma.wishlistItem.findMany = originalFindMany;
    prisma.wishlistItem.deleteMany = originalDeleteMany;
    prisma.wishlistItem.create = originalCreate;
  });

  prisma.product.findUnique = async () => ({ id: 77 });
  prisma.wishlistItem.findMany = async () => [{ id: 120, productId: 77 }];
  prisma.wishlistItem.deleteMany = async () => ({ count: 1 });
  prisma.wishlistItem.create = async () => ({ id: 121, productId: 77 });

  const result = await toggleWishlistItem(9, { productSlug: "pet-bed", productName: "Bed", unitPrice: 60 });

  assert.equal(result.action, "removed");
  assert.deepEqual(result.itemIds, [120]);
});

test("toggleWishlistItem keeps an existing item when ensurePresent is enabled", async (t) => {
  const originalProductFindUnique = prisma.product.findUnique;
  const originalFindMany = prisma.wishlistItem.findMany;
  const originalDeleteMany = prisma.wishlistItem.deleteMany;

  t.after(() => {
    prisma.product.findUnique = originalProductFindUnique;
    prisma.wishlistItem.findMany = originalFindMany;
    prisma.wishlistItem.deleteMany = originalDeleteMany;
  });

  prisma.product.findUnique = async () => ({ id: 44 });
  prisma.wishlistItem.findMany = async () => [{ id: 99, productId: 44 }];
  prisma.wishlistItem.deleteMany = async () => {
    throw new Error("An ensured wishlist item must not be deleted");
  };

  const result = await toggleWishlistItem(
    8,
    { productId: 44, productName: "Bed", unitPrice: 60 },
    { ensurePresent: true }
  );

  assert.equal(result.action, "existing");
  assert.equal(result.item.id, 99);
});

test("createReview stores a review and notification payload", async (t) => {
  const originalFindFirst = prisma.review.findFirst;
  const originalCreate = prisma.review.create;
  const originalNotificationCreate = prisma.notification.create;

  t.after(() => {
    prisma.review.findFirst = originalFindFirst;
    prisma.review.create = originalCreate;
    prisma.notification.create = originalNotificationCreate;
  });

  prisma.review.findFirst = async () => null;
  prisma.review.create = async (args) => args.data;
  prisma.notification.create = async (args) => args.data;

  const result = await createReview(5, {
    productId: 88,
    rating: 5,
    title: "Great",
    comment: "Loved it",
  });

  assert.equal(result.review.productId, 88);
  assert.equal(result.notification.title, "New review received");
});
