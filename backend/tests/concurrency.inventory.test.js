import test from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/database/prismaClient.js";
import { updateOrderStatus, resolveRefundRequest } from "../src/services/admin/orderService.js";

// This test suite simulates concurrent transitions against a shared in-memory
// store by monkeypatching prisma methods used by the order service. It
// implements row-level locks for Orders and Products to exercise the
// transaction logic and ensure idempotency and inventory integrity.

let store = {};
let locks = { orders: new Map(), products: new Map() };

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const acquire = async (map, key) => {
  while (map.get(key)) await delay(5);
  map.set(key, true);
};
const release = (map, key) => map.delete(key);

const resetStore = () => {
  store = {
    products: [{ id: 1, stock: 8 }],
    orders: [
      {
        id: 100,
        orderNumber: "ORD-100",
        status: "processing",
        paymentStatus: "pending",
        items: [{ productId: 1, quantity: 2 }],
        metadata: {},
      },
      {
        id: 200,
        orderNumber: "ORD-200",
        status: "refund_requested",
        paymentStatus: "paid",
        items: [{ productId: 1, quantity: 2 }],
        metadata: {},
      },
      {
        id: 300,
        orderNumber: "ORD-300",
        status: "delivered",
        paymentStatus: "paid",
        items: [{ productId: 1, quantity: 2 }],
        metadata: {},
      },
    ],
    inventoryTransactions: [],
    statusHistory: [],
  };
  locks = { orders: new Map(), products: new Map() };
};

const wirePrismaMocks = () => {
  // Basic finders
  prisma.order = {
    findFirst: async ({ where }) => store.orders.find((o) => o.id === where.id) || null,
    update: async ({ where, data }) => {
      const o = store.orders.find((x) => x.id === where.id);
      Object.assign(o, data);
      return o;
    },
  };

  prisma.product = {
    findUnique: async ({ where }) => store.products.find((p) => p.id === where.id) || null,
    update: async ({ where, data }) => {
      const p = store.products.find((x) => x.id === where.id);
      Object.assign(p, data);
      return p;
    },
  };

  prisma.inventoryTransaction = {
    create: async ({ data }) => {
      const id = store.inventoryTransactions.length + 1;
      const rec = { id, ...data };
      store.inventoryTransactions.push(rec);
      return rec;
    },
    findFirst: async ({ where }) => {
      const reasonContains = where.reason && where.reason.contains ? where.reason.contains : null;
      return (
        store.inventoryTransactions.find((t) => {
          if (t.productId !== where.productId) return false;
          if (where.type && t.type !== where.type) return false;
          if (reasonContains && !(t.reason && t.reason.includes(reasonContains))) return false;
          return true;
        }) || null
      );
    },
    update: async ({ where, data }) => {
      const t = store.inventoryTransactions.find((x) => x.id === where.id);
      Object.assign(t, data);
      return t;
    },
  };

  prisma.orderStatusHistory = {
    create: async ({ data }) => {
      store.statusHistory.push({ id: store.statusHistory.length + 1, ...data });
      return data;
    },
  };

  // $queryRaw to simulate SELECT ... FOR UPDATE locking
  const localAcquireLock = async (entity, id) => {
    const map = entity === "Product" ? locks.products : locks.orders;
    await acquire(map, id);
  };

  prisma.$transaction = async (fn) => {
    // Provide a tx object with methods mapping to the store but using locks
    const tx = {
      $queryRaw: async (strings, ...values) => {
        // Prefer inspecting template values when available (tagged template)
        // If values provided, assume first numeric value is the id.
        if (Array.isArray(strings) && strings.raw && values && values.length) {
          const idCandidate = values.find((v) => typeof v === "number");
          if (typeof idCandidate === "number") {
            // determine whether Product or Order appears in template
            const tmpl = String(strings[0] || "") + (strings[1] || "");
            if (tmpl.includes("Product")) {
              await localAcquireLock("Product", idCandidate);
              return [store.products.find((p) => p.id === idCandidate) || null];
            }
            if (tmpl.includes("Order")) {
              await localAcquireLock("Order", idCandidate);
              return [store.orders.find((o) => o.id === idCandidate) || null];
            }
          }
        }

        // fallback: crude string matching
        let q = "";
        if (typeof strings === "string") q = strings;
        const prodMatch = q.match(/FROM "Product" WHERE id = (\d+) FOR UPDATE/);
        if (prodMatch) {
          const id = Number(prodMatch[1]);
          await localAcquireLock("Product", id);
          return [store.products.find((p) => p.id === id) || null];
        }
        const orderMatch = q.match(/FROM "Order" WHERE id = (\d+) FOR UPDATE/);
        if (orderMatch) {
          const id = Number(orderMatch[1]);
          await localAcquireLock("Order", id);
          return [store.orders.find((o) => o.id === id) || null];
        }
        return [];
      },
      product: {
        findUnique: async ({ where }) => store.products.find((p) => p.id === where.id) || null,
        update: async ({ where, data }) => {
          const p = store.products.find((x) => x.id === where.id);
          // debug
          // console.log('tx.product.update', where, data);
          Object.assign(p, data);
          return p;
        },
      },
      inventoryTransaction: prisma.inventoryTransaction,
      order: {
        update: async ({ where, data, include }) => {
          const o = store.orders.find((x) => x.id === where.id);
          Object.assign(o, data);
          return { ...o, customer: null };
        },
        create: async ({ data }) => {
          const id = store.orders.length + 1;
          const ord = { id, ...data };
          store.orders.push(ord);
          return ord;
        },
      },
      orderStatusHistory: prisma.orderStatusHistory,
    };

    try {
      const result = await fn(tx);
      // release locks
      locks.orders.clear();
      locks.products.clear();
      return result;
    } catch (err) {
      locks.orders.clear();
      locks.products.clear();
      throw err;
    }
  };
};

// Helper to call updateOrderStatus as a customer actor
const customerCancel = (orderId, customerId) => updateOrderStatus(orderId, "cancelled", { id: customerId, type: "customer", note: "Order cancelled by customer" });
const adminCancel = (orderId, adminId) => updateOrderStatus(orderId, "cancelled", { id: adminId, type: "admin", note: "Order cancelled by admin" });

// Tests

test("Duplicate Customer Cancellation restores inventory only once", async () => {
  resetStore();
  wirePrismaMocks();

  // Two concurrent cancellations
  const p1 = customerCancel(100, 1);
  const p2 = customerCancel(100, 1);

  const [r1, r2] = await Promise.allSettled([p1, p2]);

  // One should succeed; the other either returns the same state or be rejected
  const successes = [r1, r2].filter((r) => r.status === "fulfilled");
  assert.ok(successes.length >= 1);

  // Inventory restored exactly once: initial stock 8 + quantity 2 = 10
  assert.equal(store.products.find((p) => p.id === 1).stock, 10);

  // Only one increase transaction created
  const increases = store.inventoryTransactions.filter((t) => t.type === "increase" && t.reason && t.reason.includes("Order ORD-100"));
  assert.equal(increases.length, 1);

  // Only one status history entry for cancelled
  const cancelledHistory = store.statusHistory.filter((h) => h.status === "cancelled" && h.orderId === 100);
  assert.equal(cancelledHistory.length, 1);
});

test("Duplicate admin refund approvals processed once", async () => {
  resetStore();
  wirePrismaMocks();

  // Two concurrent approvals
  const p1 = resolveRefundRequest(200, "approve", { actor: { id: 10, type: "admin" }, reason: "Approved" });
  const p2 = resolveRefundRequest(200, "approve", { actor: { id: 11, type: "admin" }, reason: "Approved" });

  const [r1, r2] = await Promise.allSettled([p1, p2]);
  const successes = [r1, r2].filter((r) => r.status === "fulfilled");
  assert.ok(successes.length >= 1);

  // Inventory restored once
  assert.equal(store.products.find((p) => p.id === 1).stock, 10);
  const increases = store.inventoryTransactions.filter((t) => t.type === "increase" && t.reason && t.reason.includes("Order ORD-200"));
  assert.equal(increases.length, 1);

  // Payment status updated once on the order
  const o = store.orders.find((x) => x.id === 200);
  assert.equal(o.paymentStatus, "refunded" || o.paymentStatus);
});

test("Customer cancel vs admin cancel: only one final cancel and single restore", async () => {
  resetStore();
  wirePrismaMocks();

  const p1 = customerCancel(100, 1);
  const p2 = adminCancel(100, 99);

  const [r1, r2] = await Promise.allSettled([p1, p2]);
  const successes = [r1, r2].filter((r) => r.status === "fulfilled");
  assert.ok(successes.length >= 1);

  assert.equal(store.products.find((p) => p.id === 1).stock, 10);
  const increases = store.inventoryTransactions.filter((t) => t.type === "increase" && t.reason && t.reason.includes("Order ORD-100"));
  assert.equal(increases.length, 1);

  const cancelledHistory = store.statusHistory.filter((h) => h.status === "cancelled" && h.orderId === 100);
  assert.equal(cancelledHistory.length, 1);
});

test("Concurrent status updates validate transitions and avoid invalid state", async () => {
  resetStore();
  wirePrismaMocks();

  // One tries to move to packed (valid), another to cancelled (valid). Race should allow one then the other may or may not be valid depending on ordering.
  const p1 = updateOrderStatus(100, "packed", { id: 5, type: "admin" });
  const p2 = updateOrderStatus(100, "cancelled", { id: 6, type: "admin" });

  const results = await Promise.allSettled([p1, p2]);
  // At least one should be rejected or the second should see the updated status and be idempotent
  const fulfilled = results.filter((r) => r.status === "fulfilled");
  const rejected = results.filter((r) => r.status === "rejected");
  assert.ok(fulfilled.length >= 1);

  // Final status should be either packed or cancelled, but consistent
  const final = store.orders.find((o) => o.id === 100).status;
  assert.ok(["packed", "cancelled"].includes(final));
});

test("Duplicate return requests accepted once", async () => {
  resetStore();
  wirePrismaMocks();

  const p1 = updateOrderStatus(300, "returned", { id: 2, type: "customer" });
  const p2 = updateOrderStatus(300, "returned", { id: 2, type: "customer" });

  const [r1, r2] = await Promise.allSettled([p1, p2]);
  const successes = [r1, r2].filter((r) => r.status === "fulfilled");
  assert.ok(successes.length >= 1);

  // Only one return status history
  const returns = store.statusHistory.filter((h) => h.status === "returned" && h.orderId === 300);
  assert.equal(returns.length, 1);
});

// Ensure inventory integrity after tests
test("Inventory integrity: stock never negative and transactions valid", () => {
  // no-op here; checks integrated into tests above
  const p = store.products.find((x) => x.id === 1);
  assert.ok(p.stock >= 0);
  const net = store.inventoryTransactions.reduce((s, t) => s + (t.change || 0), 0);
  // net change should equal finalStock - initialStock (initial 8)
  const final = p.stock;
  assert.equal(final - 8, net);
});
