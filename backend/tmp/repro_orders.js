import createApp from '../src/app.js';
import prisma from '../src/database/prismaClient.js';
import { setStripeClientForTests } from '../src/routes/payments.js';

const store = {
  products: [{ id: 1, price: 10.0, metadata: {}, stock: 10 }],
  customers: [{ id: 1, email: 'user1@example.com' }],
  coupons: [{ id: 1, code: 'TEST10', discountType: 'percent', discount: 50, status: 'active', usageLimit: 1, usageCount: 0, perUserLimit: 1, minOrderAmount: 0 }],
  couponUsages: [],
  orders: [],
  payments: [],
};

const stripeMock = {
  customers: { create: async () => ({ id: 'cus_test' }) },
  paymentIntents: {
    create: async (data) => ({ id: 'pi_test', client_secret: 'secret', status: 'requires_payment_method', metadata: data.metadata }),
    retrieve: async (id) => ({ id, status: 'succeeded' }),
    cancel: async (id) => ({ id, canceled: true }),
    update: async (id, data) => ({ id, ...data }),
  },
};

setStripeClientForTests(stripeMock);

prisma.product = {
  findMany: async ({ where, select }) => {
    const ids = where.id.in || [];
    return store.products.filter((p) => ids.includes(p.id)).map((p) => ({ id: p.id, price: p.price, metadata: p.metadata, stock: p.stock }));
  },
};

prisma.customer = {
  findUnique: async ({ where }) => store.customers.find((c) => (where.id ? c.id === where.id : c.email === where.email)) || null,
  create: async ({ data }) => {
    const id = store.customers.length + 1;
    const customer = { id, email: data.email, fullName: data.fullName || 'Guest', status: data.status };
    store.customers.push(customer);
    return customer;
  },
};

prisma.coupon = {
  findUnique: async ({ where }) => store.coupons.find((c) => c.code === where.code || c.id === where.id) || null,
  update: async ({ where, data }) => {
    const c = store.coupons.find((x) => x.id === where.id);
    if (!c) throw new Error('Coupon not found');
    if (data.usageCount?.increment) c.usageCount += data.usageCount.increment;
    return c;
  },
};

prisma.couponUsage = {
  create: async ({ data }) => {
    const exists = store.couponUsages.find((u) => u.couponId === data.couponId && u.customerId === data.customerId && u.orderId === data.orderId);
    if (exists) throw new Error('Unique constraint violated');
    const id = store.couponUsages.length + 1;
    const rec = { id, ...data, createdAt: new Date().toISOString() };
    store.couponUsages.push(rec);
    return rec;
  },
  count: async ({ where }) => store.couponUsages.filter((u) => u.couponId === where.couponId && u.customerId === where.customerId).length,
};

prisma.order = {
  create: async ({ data }) => {
    const id = store.orders.length + 1;
    const ord = { id, ...data };
    store.orders.push(ord);
    return ord;
  },
  findFirst: async ({ where }) => store.orders.find((o) => o.id === where.id) || null,
};

prisma.payment = {
  create: async ({ data }) => {
    const id = store.payments.length + 1;
    const p = { id, ...data };
    store.payments.push(p);
    return p;
  },
};

prisma.$transaction = async (fn) => {
  const backup = JSON.parse(JSON.stringify(store));
  try {
    return await fn(prisma);
  } catch (err) {
    Object.assign(store, JSON.parse(JSON.stringify(backup)));
    throw err;
  }
};

const app = createApp();
const server = app.listen(0);
server.once('listening', async () => {
  const port = server.address().port;
  const payload = { items: [{ id: 1, quantity: 2 }], totalAmount: 20, customerEmail: 'user1@example.com', paymentMethod: 'card', couponCode: 'TEST10' };
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    console.log('status', res.status);
    console.log('body', body);
  } catch (err) {
    console.error('fetch error', err);
  } finally {
    server.close();
  }
});
