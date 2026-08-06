import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
const fetch = globalThis.fetch;

// Mocks and in-memory DB
import prisma from "../src/database/prismaClient.js";
import { setStripeClientForTests } from "../src/routes/payments.js";

import createApp from "../src/app.js";

// In-memory store
const store = {
  products: [],
  customers: [],
  coupons: [],
  couponUsages: [],
  orders: [],
  payments: [],
};

let stripeCalls = { created: [], cancelled: [], retrieved: [], updated: [] };

// Simple lock map for coupon ids
const couponLocks = new Map();
const acquireLock = async (couponId) => {
  while (couponLocks.get(couponId)) {
    await new Promise((r) => setTimeout(r, 5));
  }
  couponLocks.set(couponId, true);
};
const releaseLock = (couponId) => couponLocks.delete(couponId);

const stripeMock = {
  customers: { create: async () => ({ id: "cus_test" }) },
  paymentIntents: {
    create: async function (data) {
      const id = `pi_${Math.random().toString(36).slice(2, 9)}`;
      stripeCalls.created.push({ id, data });
      return { id, client_secret: `secret_${id}`, status: "requires_payment_method", metadata: data.metadata };
    },
    retrieve: async function (id) {
      stripeCalls.retrieved.push(id);
      return { id, status: "succeeded" };
    },
    cancel: async function (id) {
      stripeCalls.cancelled.push(id);
      return { id, canceled: true };
    },
    update: async function (id, data) {
      stripeCalls.updated.push({ id, data });
      return { id, ...data };
    },
  },
};
setStripeClientForTests(stripeMock);

// Helper to reset store
const resetStore = () => {
  store.products = [
    { id: 1, price: 10.0, metadata: {}, stock: 10 },
    { id: 2, price: 5.0, metadata: {}, stock: 10 },
  ];
  store.customers = [{ id: 1, email: "user1@example.com" }, { id: 2, email: "user2@example.com" }];
  store.coupons = [{ id: 1, code: "TEST10", discountType: "percent", discount: 50, status: "active", usageLimit: 1, usageCount: 0, perUserLimit: 1, minOrderAmount: 0 }];
  store.couponUsages = [];
  store.orders = [];
  store.payments = [];
  stripeCalls = { created: [], cancelled: [], retrieved: [], updated: [] };
};

// Mock prisma methods used by the code
const wirePrismaMocks = () => {
  // products
  prisma.product = {
    findMany: async ({ where, select }) => {
      const ids = [
        ...(where?.id?.in || []),
        ...(where?.OR || [])
        .flatMap((condition) => condition?.id?.in || [])
      ].map(Number);
      return store.products.filter((p) => ids.includes(p.id)).map((p) => ({ id: p.id, price: p.price, metadata: p.metadata, stock: p.stock }));
    },
  };

  // customers
  prisma.customer = {
    findUnique: async ({ where }) => store.customers.find((c) => (where.id ? c.id === where.id : c.email === where.email)) || null,
    create: async ({ data }) => {
      const id = store.customers.length + 1;
      const customer = { id, email: data.email, fullName: data.fullName || "Guest" };
      store.customers.push(customer);
      return customer;
    },
  };

  // coupons
  prisma.coupon = {
    findUnique: async ({ where }) => store.coupons.find((c) => c.code === where.code || c.id === where.id) || null,
    update: async ({ where, data }) => {
      const c = store.coupons.find((x) => x.id === where.id);
      if (!c) throw new Error("Coupon not found");
      if (data.usageCount && data.usageCount.increment) c.usageCount += data.usageCount.increment;
      return c;
    },
  };

  // couponUsage
  prisma.couponUsage = {
    create: async ({ data }) => {
      // enforce unique composite (couponId, customerId, orderId)
      const exists = store.couponUsages.find((u) => u.couponId === data.couponId && u.customerId === data.customerId && u.orderId === data.orderId);
      if (exists) throw new Error("Unique constraint violated");
      const id = store.couponUsages.length + 1;
      const rec = { id, ...data, createdAt: new Date().toISOString() };
      store.couponUsages.push(rec);
      return rec;
    },
    count: async ({ where }) => {
      return store.couponUsages.filter((u) => u.couponId === where.couponId && u.customerId === where.customerId).length;
    },
  };

  // orders
  prisma.order = {
    create: async ({ data }) => {
      // simulate auto-increment id
      const id = store.orders.length + 1;
      const ord = { id, ...data };
      store.orders.push(ord);
      return ord;
    },
    count: async ({ where }) => {
      return store.orders.filter((o) => o.customerId === where.customerId).length;
    },
    findFirst: async ({ where, include }) => store.orders.find((o) => o.id === where.id) || null,
  };

  // payment
  prisma.payment = {
    create: async ({ data }) => {
      const id = store.payments.length + 1;
      const p = { id, ...data };
      store.payments.push(p);
      return p;
    },
    findFirst: async ({ where, include }) => store.payments.find((p) => p.orderId === where.orderId) || null,
    update: async ({ where, data }) => {
      const p = store.payments.find((x) => x.id === where.id);
      Object.assign(p, data);
      return p;
    },
  };

  // transaction implementation: clone store, execute fn with transaction object, commit/rollback
  prisma.$transaction = async (fn) => {
    // create shallow clones
    const backup = JSON.parse(JSON.stringify(store));
    // transaction object proxies to operations that mutate store but we need locking logic
    const transaction = {
      address: { create: async ({ data }) => ({ id: 1, ...data }) },
      order: { create: async ({ data }) => {
        const id = store.orders.length + 1;
        const ord = { id, ...data };
        store.orders.push(ord);
        return ord;
      } },
      payment: { create: async ({ data }) => {
        const id = store.payments.length + 1;
        const p = { id, ...data };
        store.payments.push(p);
        return p;
      } },
      orderStatusHistory: { create: async ({ data }) => ({ id: store.orders.length + 1, ...data }) },
      couponUsage: prisma.couponUsage,
      coupon: prisma.coupon,
      $queryRaw: async (...args) => {
        // Handle tagged template or raw string and reconstruct full query
        let qstr = "";
        if (Array.isArray(args[0]) && args[0].raw) {
          const strings = args[0];
          const values = args.slice(1);
          qstr = strings[0];
          for (let i = 0; i < values.length; i++) {
            qstr += String(values[i]) + (strings[i + 1] || "");
          }
        } else if (typeof args[0] === "string") {
          qstr = args[0];
        } else {
          qstr = String(args[0]);
        }

        // crude parse: expect WHERE id = <num> FOR UPDATE
        const idMatch = qstr.match(/WHERE id = (\d+) FOR UPDATE/);
        if (idMatch) {
          const cid = Number(idMatch[1]);
          await acquireLock(cid);
          const c = store.coupons.find((x) => x.id === cid);
          return [c];
        }
        return [];
      },
    };

    try {
      const result = await fn(transaction);
      // release any locks
      couponLocks.clear();
      return result;
    } catch (err) {
      // rollback
      Object.keys(backup).forEach((k) => (store[k] = backup[k]));
      couponLocks.clear();
      throw err;
    }
  };
};

// Start server helper
const startServer = async () => {
  const app = createApp();
  const server = app.listen(0);
  await once(server, "listening");
  const addr = server.address();
  const base = `http://127.0.0.1:${addr.port}/api`;
  return { server, base };
};

// Tests
test("Integration: create-order with coupon succeeds and records usage", async (t) => {
  resetStore();
  wirePrismaMocks();

  const { server, base } = await startServer();

  const payload = {
    items: [{ id: 1, quantity: 2 }],
    totalAmount: 20,
    customerEmail: "user1@example.com",
    paymentMethod: "card",
    couponCode: "TEST10",
  };

  const res = await fetch(`${base}/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.ok(body.data.order);
  assert.ok(body.data.payment);
  // Server calculation should be present
  assert.equal(body.data.serverCalculation.discount, 10); // 50% of subtotal 20 -> 10
  // The authoritative total includes the 10% tax applied after the coupon.
  assert.equal(body.data.serverCalculation.finalTotal, 11);
  // coupon usage recorded
  assert.equal(store.couponUsages.length, 1);
  assert.equal(store.coupons[0].usageCount, 1);
  assert.equal(store.orders[0].couponId, 1);
  // PaymentIntent created
  assert.equal(stripeCalls.created.length, 1);

  server.close();
});

test("Integration: create-order computes shipping and tax in serverCalculation", async (t) => {
  resetStore();
  wirePrismaMocks();

  const { server, base } = await startServer();

  const payload = {
    items: [{ id: 1, quantity: 1 }],
    totalAmount: 10,
    customerEmail: "user1@example.com",
    paymentMethod: "card",
    metadata: {
      deliveryMethod: "express",
    },
  };

  const res = await fetch(`${base}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.data.serverCalculation.subtotal, 10);
  assert.equal(body.data.serverCalculation.discount, 0);
  assert.equal(body.data.serverCalculation.shipping, 99);
  assert.equal(body.data.serverCalculation.tax, 1);
  assert.equal(body.data.serverCalculation.finalTotal, 110);
  assert.equal(body.data.order.metadata.shippingAmount, 99);
  assert.equal(body.data.order.metadata.taxAmount, 1);
  assert.equal(body.data.order.metadata.deliveryMethod, "express");

  server.close();
});

test("Transaction rollback cancels PaymentIntent and does not persist coupon usage", async (t) => {
  resetStore();
  wirePrismaMocks();

  // modify prisma.$transaction to throw after creating order to simulate DB failure
  const originalTransaction = prisma.$transaction;
  prisma.$transaction = async (fn) => originalTransaction(async (transaction) => {
    await fn(transaction);
    // Throw inside the transaction so the mock performs its rollback, matching
    // real database transaction semantics.
    throw new Error("Simulated DB failure during transaction");
  });

  // To capture cancel calls, ensure Stripe prototype cancel is present (already mocked)
  const { server, base } = await startServer();

  const payload = {
    items: [{ id: 1, quantity: 2 }],
    totalAmount: 20,
    customerEmail: "user2@example.com",
    paymentMethod: "card",
    couponCode: "TEST10",
  };

  let res, body;
  try {
    res = await fetch(`${base}/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    body = await res.json();
  } catch (err) {
    // expect an error
  }

  // Transaction should have rolled back: no coupon usage recorded
  assert.equal(store.couponUsages.length, 0);
  // usageCount not incremented
  assert.equal(store.coupons[0].usageCount, 0);
  // No order created
  assert.equal(store.orders.length, 0);
  // PaymentIntent was created then cancelled
  assert.equal(stripeCalls.created.length >= 1, true);
  assert.equal(stripeCalls.cancelled.length >= 1, true);

  prisma.$transaction = originalTransaction;
  server.close();
});

// Concurrency: two customers try to redeem last coupon
test("Concurrency: only one of two customers redeems a coupon with usageLimit=1", async (t) => {
  resetStore();
  wirePrismaMocks();

  // increase realism: usageLimit 1 already set
  const { server, base } = await startServer();

  const payload1 = { items: [{ id: 1, quantity: 1 }], totalAmount: 10, customerEmail: "user1@example.com", paymentMethod: "card", couponCode: "TEST10" };
  const payload2 = { items: [{ id: 1, quantity: 1 }], totalAmount: 10, customerEmail: "user2@example.com", paymentMethod: "card", couponCode: "TEST10" };

  const p1 = fetch(`${base}/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload1) });
  const p2 = fetch(`${base}/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload2) });

  const results = await Promise.allSettled([p1, p2]);
  const statuses = results.map((r) => (r.status === "fulfilled" ? r.value.status : null));
  assert.equal(statuses.filter((s) => s === 200).length, 1);
  assert.equal(statuses.filter((s) => s === 400).length, 1);
  server.close();
});

// Per-user limit: same user multiple requests
test("Concurrency: per-user limit enforced when same user sends multiple requests", async (t) => {
  resetStore();
  wirePrismaMocks();
  const { server, base } = await startServer();

  const payload = { items: [{ id: 1, quantity: 1 }], totalAmount: 10, customerEmail: "user1@example.com", paymentMethod: "card", couponCode: "TEST10" };

  const p1 = fetch(`${base}/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const p2 = fetch(`${base}/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

  const results = await Promise.allSettled([p1, p2]);
  const statuses = results.map((r) => (r.status === "fulfilled" ? r.value.status : null));
  assert.equal(statuses.filter((s) => s === 200).length, 1);
  assert.equal(statuses.filter((s) => s === 400).length, 1);

  server.close();
});

// Security tests
test("Security: modified client totals are ignored and server-calculated totals used", async (t) => {
  resetStore();
  wirePrismaMocks();
  const { server, base } = await startServer();

  const payload = { items: [{ id: 1, quantity: 2 }], totalAmount: 9999, customerEmail: "user1@example.com", paymentMethod: "card" };
  const res = await fetch(`${base}/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body = await res.json();
  assert.equal(res.status, 200);
  // serverCalculation.finalTotal should be authoritative (2 * 10 + tax 2 = 22)
  assert.equal(body.data.serverCalculation.finalTotal, 22);
  assert.equal(body.data.serverCalculation.shipping, 0);
  assert.equal(body.data.serverCalculation.tax, 2);

  server.close();
});

// Stripe metadata test
test("Stripe PaymentIntent contains coupon metadata", async (t) => {
  resetStore();
  wirePrismaMocks();
  const { server, base } = await startServer();

  const payload = { items: [{ id: 1, quantity: 2 }], totalAmount: 20, customerEmail: "user1@example.com", paymentMethod: "card", couponCode: "TEST10" };
  const res = await fetch(`${base}/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(stripeCalls.created.length, 1);
  const createdCall = stripeCalls.created[0];
  assert.equal(createdCall.data.metadata.couponCode, "TEST10");
  server.close();
});

test("Integration: POST /orders records coupon usage for customer checkout", async (t) => {
  resetStore();
  wirePrismaMocks();
  const { server, base } = await startServer();

  const payload = { items: [{ id: 1, quantity: 2 }], totalAmount: 20, customerEmail: "user1@example.com", paymentMethod: "card", couponCode: "TEST10" };
  const res = await fetch(`${base}/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(store.couponUsages.length, 1);
  assert.equal(store.coupons[0].usageCount, 1);
  assert.equal(store.orders[0].couponId, 1);

  server.close();
});
// Run cleanup at the end
test("cleanup", async () => {
  // nothing
});
