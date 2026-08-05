import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";

import prisma from "../src/database/prismaClient.js";
import { setStripeClientForTests } from "../src/routes/payments.js";
import createApp from "../src/app.js";

// Mock Stripe webhooks.constructEvent to throw on invalid signature
setStripeClientForTests({
  webhooks: {
    constructEvent: (payload, signature) => {
      if (signature === "invalid") throw new Error("Invalid signature");
      return JSON.parse(payload);
    },
  },
});

const startServer = async () => {
  const app = createApp();
  const server = app.listen(0);
  await once(server, "listening");
  const addr = server.address();
  const base = `http://127.0.0.1:${addr.port}/api`;
  return { server, base };
};

// Simple in-memory store for webhook test
const webhookStore = {};
prisma.stripeWebhookEvent = {
  create: async ({ data }) => {
    if (webhookStore[data.eventId]) throw new Error("Unique constraint");
    webhookStore[data.eventId] = { ...data };
    return webhookStore[data.eventId];
  },
  findUnique: async ({ where }) => webhookStore[where.eventId] || null,
  updateMany: async ({ where, data }) => {
    if (webhookStore[where.eventId]) Object.assign(webhookStore[where.eventId], data);
    return {};
  },
  update: async ({ where, data }) => {
    if (webhookStore[where.eventId]) Object.assign(webhookStore[where.eventId], data);
    return webhookStore[where.eventId];
  },
};
prisma.payment = {
  findFirst: async () => null,
};

test("Webhook: invalid signature returns 400", async () => {
  const { server, base } = await startServer();

  const res = await fetch(`${base}/payment/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "stripe-signature": "invalid" },
    body: JSON.stringify({ id: "evt_test", type: "payment_intent.succeeded", data: { object: { id: "pi_123" } } }),
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  // Cleanup
  server.close();
});

test("Webhook: duplicate event is ignored and stored", async () => {
  const { server, base } = await startServer();

  // First delivery should create DB row
  const payload = JSON.stringify({ id: "evt_dup", type: "payment_intent.succeeded", data: { object: { id: "pi_dup" } } });
  const res1 = await fetch(`${base}/payment/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "stripe-signature": "valid" },
    body: payload,
  });
  assert.strictEqual(res1.status, 200);

  // Second delivery should be ignored (duplicate)
  const res2 = await fetch(`${base}/payment/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "stripe-signature": "valid" },
    body: payload,
  });
  assert.strictEqual(res2.status, 200);

  // Check DB entry exists
  const row = await prisma.stripeWebhookEvent.findUnique({ where: { eventId: "evt_dup" } });
  assert.ok(row, "Webhook event row should be created");

  server.close();
});
