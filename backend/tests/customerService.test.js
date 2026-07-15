import test from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/database/prismaClient.js";
import { getCustomers, updateCustomerStatus } from "../src/services/admin/customerService.js";

test("getCustomers builds searchable, paginated summaries from Prisma data", async (t) => {
  const originalFindMany = prisma.customer.findMany;
  const originalCount = prisma.customer.count;

  t.after(() => {
    prisma.customer.findMany = originalFindMany;
    prisma.customer.count = originalCount;
  });

  prisma.customer.findMany = async ({ where, orderBy, skip, take }) => {
    assert.equal(where.deletedAt, null);
    assert.equal(where.status, "active");
    assert.equal(where.OR[0].email.contains, "ava");
    assert.equal(orderBy.createdAt, "desc");
    assert.equal(skip, 0);
    assert.equal(take, 10);

    return [
      {
        id: 7,
        email: "ava@example.com",
        firstName: "Ava",
        lastName: "Martinez",
        fullName: null,
        phone: "+1 555 0100",
        status: "active",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        lastLoginAt: new Date("2024-02-01T00:00:00.000Z"),
        addresses: [],
        orders: [{ id: 11, totalAmount: 120, status: "delivered", placedAt: new Date("2024-02-01T00:00:00.000Z") }],
        wishlistItems: [{ id: 4 }],
      },
    ];
  };

  prisma.customer.count = async ({ where }) => {
    assert.equal(where.deletedAt, null);
    return 1;
  };

  const result = await getCustomers({ q: "ava", page: 1, limit: 10, status: "active", sortBy: "createdAt", order: "desc" });

  assert.equal(result.total, 1);
  assert.equal(result.page, 1);
  assert.equal(result.pageSize, 10);
  assert.equal(result.items[0].name, "Ava Martinez");
  assert.equal(result.items[0].totalOrders, 1);
  assert.equal(result.items[0].totalSpent, 120);
  assert.equal(result.items[0].wishlistCount, 1);
});

test("updateCustomerStatus flips a customer to blocked or active", async (t) => {
  const originalFindFirst = prisma.customer.findFirst;
  const originalUpdate = prisma.customer.update;

  t.after(() => {
    prisma.customer.findFirst = originalFindFirst;
    prisma.customer.update = originalUpdate;
  });

  prisma.customer.findFirst = async ({ where }) => ({ id: 9, status: "active" });
  prisma.customer.update = async ({ where, data }) => {
    assert.equal(where.id, 9);
    assert.equal(data.status, "blocked");
    return { id: 9, status: "blocked", email: "demo@example.com" };
  };

  const updated = await updateCustomerStatus(9, "blocked");
  assert.equal(updated.status, "blocked");
});
