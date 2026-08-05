import Stripe from 'stripe';
import prisma from './src/database/prismaClient.js';
import createApp from './src/app.js';

// Minimal mocks similar to integration test
const store = {
  products: [{ id: 1, price: 10.0, metadata: {} }, { id: 2, price: 5.0, metadata: {} }],
  customers: [{ id: 1, email: 'user1@example.com' }],
  coupons: [{ id: 1, code: 'TEST10', discountType: 'percent', discount: 50, status: 'active', usageLimit: 1, usageCount: 0, perUserLimit: 1, minOrderAmount: 0 }],
  couponUsages: [],
  orders: [],
  payments: [],
};

let stripeCalls = { created: [], cancelled: [], retrieved: [] };

Stripe.prototype.paymentIntents = {
  create: async function (data) {
    const id = `pi_${Math.random().toString(36).slice(2, 9)}`;
    stripeCalls.created.push({ id, data });
    return { id, client_secret: `secret_${id}`, status: 'requires_payment_method' };
  },
  retrieve: async function (id) {
    stripeCalls.retrieved.push(id);
    return { id, status: 'succeeded' };
  },
  cancel: async function (id) {
    stripeCalls.cancelled.push(id);
    return { id, canceled: true };
  },
};

// Wire minimal prisma methods
prisma.product = { findMany: async ({ where }) => store.products.filter((p) => where.id.in.includes(p.id)).map(p => ({ id: p.id, price: p.price, metadata: p.metadata })) };
prisma.customer = { findUnique: async ({ where }) => store.customers.find(c => (where.id ? c.id === where.id : c.email === where.email)) || null, create: async ({ data }) => { const id = store.customers.length + 1; const customer = { id, email: data.email, fullName: data.fullName || 'Guest' }; store.customers.push(customer); return customer; } };
prisma.coupon = { findUnique: async ({ where }) => store.coupons.find(c => c.code === where.code || c.id === where.id) || null, update: async ({ where, data }) => { const c = store.coupons.find(x => x.id === where.id); if (!c) throw new Error('Coupon not found'); if (data.usageCount && data.usageCount.increment) c.usageCount += data.usageCount.increment; return c; } };
prisma.couponUsage = { create: async ({ data }) => { const id = store.couponUsages.length + 1; const rec = { id, ...data, createdAt: new Date().toISOString() }; store.couponUsages.push(rec); return rec; }, count: async ({ where }) => store.couponUsages.filter(u => u.couponId === where.couponId && u.customerId === where.customerId).length };
prisma.order = { create: async ({ data }) => { const id = store.orders.length + 1; const ord = { id, ...data }; store.orders.push(ord); return ord; }, count: async ({ where }) => store.orders.filter(o => o.customerId === where.customerId).length, findFirst: async ({ where }) => store.orders.find(o => o.id === where.id) || null };
prisma.payment = { create: async ({ data }) => { const id = store.payments.length + 1; const p = { id, ...data }; store.payments.push(p); return p; }, findFirst: async ({ where }) => store.payments.find(p => p.orderId === where.orderId) || null, update: async ({ where, data }) => { const p = store.payments.find(x => x.id === where.id); Object.assign(p, data); return p; } };
prisma.$transaction = async (fn) => {
  const backup = JSON.parse(JSON.stringify(store));
  const transaction = {
    address: { create: async ({ data }) => ({ id: 1, ...data }) },
    order: { create: async ({ data }) => { const id = store.orders.length + 1; const ord = { id, ...data }; store.orders.push(ord); return ord; } },
    payment: { create: async ({ data }) => { const id = store.payments.length + 1; const p = { id, ...data }; store.payments.push(p); return p; } },
    orderStatusHistory: { create: async ({ data }) => ({ id: store.orders.length + 1, ...data }) },
    couponUsage: prisma.couponUsage,
    coupon: prisma.coupon,
    $queryRaw: async (...args) => []
  };
  try {
    const result = await fn(transaction);
    return result;
  } catch (err) {
    Object.keys(backup).forEach(k => store[k] = backup[k]);
    throw err;
  }
};

(async () => {
  const app = createApp();
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const addr = server.address();
  const base = `http://127.0.0.1:${addr.port}/api`;

  const payload = {
    items: [{ id: 1, quantity: 2 }],
    totalAmount: 20,
    customerEmail: 'user1@example.com',
    paymentMethod: 'card',
    couponCode: 'TEST10',
  };

  try {
    const res = await fetch(`${base}/payment/create-order`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': `debug-${Date.now()}-${Math.random().toString(36).slice(2,6)}` }, body: JSON.stringify(payload) });
    const body = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', body);
  } catch (err) {
    console.error('REQ ERROR', err.stack || err);
  } finally {
    server.close();
  }
})();
