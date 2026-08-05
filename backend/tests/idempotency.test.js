import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
const fetch = globalThis.fetch;

process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key";

const prismaModule = await import("../src/database/prismaClient.js");
const prisma = prismaModule.default || prismaModule;
const appModule = await import("../src/app.js");
const createApp = appModule.default || appModule;
const paymentsModule = await import("../src/routes/payments.js");
const { setStripeClientForTests } = paymentsModule;

// In-memory store
const store = {
  products: [],
  customers: [],
  coupons: [],
  couponUsages: [],
  orders: [],
  payments: [],
  idempotencyKeys: [],
};

let stripeCalls = { created: [], cancelled: [], retrieved: [] };

const stripeMock = {
  customers: { create: async () => ({ id: "cus_test" }) },
  paymentIntents: {
  create: async function (data) {
    const id = `pi_${Math.random().toString(36).slice(2, 9)}`;
    stripeCalls.created.push({ id, data });
    return { id, client_secret: `secret_${id}`, status: "requires_payment_method" };
  },
  retrieve: async function (id) {
    stripeCalls.retrieved.push(id);
    return { id, status: "succeeded" };
  },
  cancel: async function (id) {
    stripeCalls.cancelled.push(id);
    return { id, canceled: true };
  },
  },
};
setStripeClientForTests(stripeMock);

const resetStore = () => {
  store.products = [{ id: 1, price: 10.0, metadata: {} }];
  store.customers = [{ id: 1, email: "user1@example.com" }];
  store.coupons = [];
  store.couponUsages = [];
  store.orders = [];
  store.payments = [];
  store.idempotencyKeys = [];
  stripeCalls = { created: [], cancelled: [], retrieved: [] };
};

const wirePrismaMocks = () => {
  prisma.product = {
    findMany: async ({ where, select }) => {
      const ids = where?.id?.in || [];
      const slugs = where?.slug?.in || [];
      const orConditions = Array.isArray(where?.OR) ? where.OR : [];
      const orIds = orConditions.flatMap((clause) => (clause?.id?.in ? clause.id.in : []));
      const orSlugs = orConditions.flatMap((clause) => (clause?.slug?.in ? clause.slug.in : []));
      const productIds = Array.from(new Set([...ids, ...orIds]));
      const productSlugs = Array.from(new Set([...slugs, ...orSlugs]));
      return store.products
        .filter((p) => productIds.includes(p.id) || productSlugs.includes(p.slug))
        .map((p) => ({ id: p.id, slug: p.slug, name: p.name, price: p.price, metadata: p.metadata, stock: p.stock, status: p.status, trackInventory: p.trackInventory, deletedAt: p.deletedAt, imageUrl: p.imageUrl }));
    },
  };

  prisma.customer = {
    findUnique: async ({ where }) => store.customers.find((c) => (where.id ? c.id === where.id : c.email === where.email)) || null,
    create: async ({ data }) => {
      const id = store.customers.length + 1;
      const customer = { id, email: data.email, fullName: data.fullName || "Guest" };
      store.customers.push(customer);
      return customer;
    },
  };

  prisma.coupon = {
    findUnique: async ({ where }) => store.coupons.find((c) => c.code === where.code || c.id === where.id) || null,
    update: async ({ where, data }) => {
      const c = store.coupons.find((x) => x.id === where.id);
      if (!c) throw new Error("Coupon not found");
      if (data.usageCount && data.usageCount.increment) c.usageCount += data.usageCount.increment;
      return c;
    },
  };

  prisma.couponUsage = {
    create: async ({ data }) => {
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

  // idempotencyKey table mocks
  prisma.$queryRaw = async (...args) => {
    // Handle tagged template
    if (Array.isArray(args[0]) && args[0].raw) {
      const strings = args[0];
      const values = args.slice(1);
      // values[0] is key, values[1] is JSON string
      const key = values[0];
      const reqJson = values[1];
      const exists = store.idempotencyKeys.find((k) => k.key === key);
      if (!exists) {
        const rec = { id: store.idempotencyKeys.length + 1, key, request: JSON.parse(reqJson), response: null, status: 'processing', createdAt: new Date().toISOString() };
        store.idempotencyKeys.push(rec);
        return [rec];
      }
      return [];
    }
    return [];
  };

  prisma.idempotencyKey = {
    findUnique: async ({ where }) => store.idempotencyKeys.find((k) => k.key === where.key) || null,
    create: async ({ data }) => {
      const existing = store.idempotencyKeys.find((k) => k.key === data.key);
      if (existing) {
        const err = new Error(`Unique constraint failed on the fields: (key)`);
        err.code = "P2002";
        throw err;
      }
      const rec = {
        id: store.idempotencyKeys.length + 1,
        key: data.key,
        request: data.request || null,
        response: data.response || null,
        status: data.status || "processing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.idempotencyKeys.push(rec);
      return rec;
    },
    update: async ({ where, data }) => {
      const existing = store.idempotencyKeys.find((k) => k.key === where.key);
      if (!existing) throw new Error("Record not found");
      if (data.request !== undefined) existing.request = data.request;
      if (data.response !== undefined) existing.response = data.response;
      if (data.status !== undefined) existing.status = data.status;
      existing.updatedAt = new Date().toISOString();
      return existing;
    },
    upsert: async ({ where, update, create }) => {
      const existing = store.idempotencyKeys.find((k) => k.key === where.key);
      if (existing) {
        if (update.response !== undefined) existing.response = update.response;
        if (update.status !== undefined) existing.status = update.status;
        existing.updatedAt = new Date().toISOString();
        return existing;
      }
      const rec = {
        id: store.idempotencyKeys.length + 1,
        key: create.key,
        request: create.request || null,
        response: create.response || null,
        status: create.status || "processed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.idempotencyKeys.push(rec);
      return rec;
    },
  };

  prisma.order = {
    create: async ({ data }) => {
      const id = store.orders.length + 1;
      const ord = { id, ...data };
      store.orders.push(ord);
      return ord;
    },
    findFirst: async ({ where, include }) => store.orders.find((o) => o.id === where.id) || null,
    count: async ({ where }) => store.orders.filter((o) => o.customerId === where.customerId).length,
  };

  prisma.payment = {
    create: async ({ data }) => {
      const id = store.payments.length + 1;
      const p = { id, ...data };
      store.payments.push(p);
      return p;
    },
    findFirst: async ({ where, include }) => store.payments.find((p) => p.orderId === where.orderId) || null,
  };

  prisma.address = { create: async ({ data }) => ({ id: 1, ...data }) };
  prisma.orderStatusHistory = { create: async ({ data }) => ({ id: store.orders.length + 1, ...data }) };

  // mimic transaction behavior similar to other tests
  prisma.$transaction = async (fn) => {
    const backup = JSON.parse(JSON.stringify(store));
    const transaction = {
      address: prisma.address,
      order: prisma.order,
      payment: prisma.payment,
      orderStatusHistory: prisma.orderStatusHistory,
      couponUsage: prisma.couponUsage,
      coupon: prisma.coupon,
      $queryRaw: async () => [],
    };
    try {
      const result = await fn(transaction);
      return result;
    } catch (err) {
      // rollback
      Object.keys(backup).forEach((k) => (store[k] = backup[k]));
      throw err;
    }
  };
};

const startServer = async () => {
  const app = createApp();
  const server = app.listen(0);
  await once(server, "listening");
  const addr = server.address();
  const base = `http://127.0.0.1:${addr.port}/api`;
  return { server, base };
};

// Tests

test("Idempotency: duplicate requests with same key only create one order", async (t) => {
  resetStore();
  wirePrismaMocks();
  const { server, base } = await startServer();

  const payload = { items: [{ id: 1, quantity: 1 }], totalAmount: 10, customerEmail: "user1@example.com", paymentMethod: "card" };
  const headers = { "Content-Type": "application/json", "Idempotency-Key": "dup-key-1" };

  const r1 = await fetch(`${base}/payment/create-order`, { method: 'POST', headers, body: JSON.stringify(payload) });
  const b1 = await r1.json();
  const r2 = await fetch(`${base}/payment/create-order`, { method: 'POST', headers, body: JSON.stringify(payload) });
  const b2 = await r2.json();

  // Both requests should ultimately result in a single stored order and one Stripe create
  assert.equal(store.orders.length, 1);
  assert.equal(stripeCalls.created.length, 1);
  // Second response should be replayed (200)
  assert.equal(r2.status, 200);

  server.close();
});

test("Idempotency: concurrent requests with same key create only one payment", async (t) => {
  resetStore();
  wirePrismaMocks();
  const { server, base } = await startServer();
  t.after(() => server.close());

  const payload = { items: [{ id: 1, quantity: 1 }], totalAmount: 10, customerEmail: "user1@example.com", paymentMethod: "card" };
  const headers = { "Content-Type": "application/json", "Idempotency-Key": "concurrent-key-1" };

  const p1 = fetch(`${base}/payment/create-order`, { method: 'POST', headers, body: JSON.stringify(payload) });
  const p2 = fetch(`${base}/payment/create-order`, { method: 'POST', headers, body: JSON.stringify(payload) });

  const results = await Promise.all([p1, p2]);
  const statuses = results.map((r) => r.status);

  // Depending on timing, the second call can observe either the in-progress
  // reservation (202) or the completed response (200). Both are safe.
  assert.ok(statuses.every((status) => status === 200 || status === 202));
  // Only one order/payment should be created
  assert.equal(store.orders.length, 1);
  assert.equal(stripeCalls.created.length, 1);

});

test("Checkout continues when Stripe Customer creation fails", async (t) => {
  resetStore();
  wirePrismaMocks();
  stripeMock.customers.create = async () => {
    throw new Error("Customer API temporarily unavailable");
  };
  stripeMock.paymentIntents.create = async function (data) {
    const id = "pi_without_customer";
    stripeCalls.created.push({ id, data });
    return { id, client_secret: `secret_${id}`, status: "requires_payment_method" };
  };

  const { server, base } = await startServer();
  t.after(() => server.close());
  try {
    const response = await fetch(`${base}/payment/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": "customer-fallback-key" },
      body: JSON.stringify({
        items: [{ id: 1, quantity: 1 }],
        totalAmount: 10,
        customerEmail: "user1@example.com",
        paymentMethod: "card",
      }),
    });

    assert.equal(response.status, 200);
    assert.equal(stripeCalls.created.length, 1);
    assert.equal(stripeCalls.created[0].data.customer, undefined);
    assert.equal(store.payments[0].stripeCustomerId, null);
  } finally {
    stripeMock.customers.create = async () => ({ id: "cus_test" });
  }
});

test("Idempotency: failed Stripe payment leaves no processed response", async (t) => {
  resetStore();
  wirePrismaMocks();
  // Make Stripe throw on create
  stripeMock.paymentIntents.create = async function () {
    throw new Error('Simulated stripe failure');
  };

  const { server, base } = await startServer();

  const payload = { items: [{ id: 1, quantity: 1 }], totalAmount: 10, customerEmail: "user1@example.com", paymentMethod: "card" };
  const headers = { "Content-Type": "application/json", "Idempotency-Key": "stripe-fail-key" };

  const res1 = await fetch(`${base}/payment/create-order`, { method: 'POST', headers, body: JSON.stringify(payload) });
  const body1 = await res1.json();
  // initial failure expected (500 or 502)
  assert.ok(res1.status >= 500);

  // subsequent request should receive 202 because original left the key in processing state
  const res2 = await fetch(`${base}/payment/create-order`, { method: 'POST', headers, body: JSON.stringify(payload) });
  assert.equal(res2.status, 202);

  server.close();
});

