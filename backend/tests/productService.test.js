import test from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/database/prismaClient.js";
import { buildInventoryHistoryResponse, getProducts } from "../src/services/shared/productService.js";

test("buildInventoryHistoryResponse formats stock changes with readable metadata", () => {
  const response = buildInventoryHistoryResponse({
    id: 7,
    change: 12,
    type: "increase",
    reason: "Supplier delivery",
    createdAt: "2026-01-01T00:00:00.000Z",
    admin: { name: "Alice" },
  });

  assert.equal(response.id, 7);
  assert.equal(response.change, 12);
  assert.equal(response.type, "increase");
  assert.equal(response.reason, "Supplier delivery");
  assert.equal(response.adminName, "Alice");
  assert.equal(response.label, "Stock increased");
});

test("getProducts builds a select-only Prisma query for the admin list endpoint", async () => {
  const originalProductModel = prisma.product;
  const calls = [];

  prisma.product = {
    count: async (args) => {
      calls.push({ type: "count", args });
      return 1;
    },
    findMany: async (args) => {
      calls.push({ type: "findMany", args });
      return [{
        id: 1,
        slug: "test-product",
        name: "Test Product",
        description: "",
        price: 10,
        stock: 3,
        status: "draft",
        imageUrl: "",
        images: [],
        tags: [],
        categoryId: null,
        brandId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        category: null,
        brand: null,
      }];
    },
  };

  try {
    const result = await getProducts({ page: 1, limit: 10, status: "draft", sortBy: "title", order: "asc" });

    assert.equal(result.total, 1);
    assert.equal(result.items.length, 1);
    assert.equal(calls[1].args.include, undefined);
    assert.equal(calls[1].args.select.name, true);
    assert.equal(calls[1].args.select.category?.select?.name, true);
  } finally {
    prisma.product = originalProductModel;
  }
});
