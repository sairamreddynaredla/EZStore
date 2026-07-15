import test from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/database/prismaClient.js";
import { buildOrderDocuments, createRefundRequest, resolveOrderTransition } from "../src/services/admin/orderService.js";

test("resolveOrderTransition allows valid lifecycle transitions", () => {
  const reserve = resolveOrderTransition("pending", "confirmed");
  assert.equal(reserve.allowed, true);
  assert.equal(reserve.inventoryAction, "reserve");

  const cancel = resolveOrderTransition("confirmed", "cancelled");
  assert.equal(cancel.allowed, true);
  assert.equal(cancel.inventoryAction, "restore");

  const invalid = resolveOrderTransition("pending", "shipped");
  assert.equal(invalid.allowed, false);
  assert.equal(invalid.inventoryAction, "none");
});

test("buildOrderDocuments returns invoice, packing slip, and shipping label payloads", () => {
  const documents = buildOrderDocuments({
    id: 10,
    orderNumber: "ORD-10",
    totalAmount: 99.99,
    customerName: "Ada Lovelace",
    items: [{ productName: "Keyboard", quantity: 2, unitPrice: 49.995 }],
  });

  assert.equal(documents.invoice.orderNumber, "ORD-10");
  assert.equal(documents.packingSlip.items[0].productName, "Keyboard");
  assert.equal(documents.shippingLabel.recipient, "Ada Lovelace");
});

test("createRefundRequest records refund metadata and updates status", async (t) => {
  const originalFindFirst = prisma.order.findFirst;
  const originalTransaction = prisma.$transaction;
  const originalCreate = prisma.orderStatusHistory.create;
  const originalCreateNote = prisma.orderNote.create;

  t.after(() => {
    prisma.order.findFirst = originalFindFirst;
    prisma.$transaction = originalTransaction;
    prisma.orderStatusHistory.create = originalCreate;
    prisma.orderNote.create = originalCreateNote;
  });

  prisma.order.findFirst = async ({ where }) => ({
    id: 12,
    orderNumber: "ORD-12",
    status: "delivered",
    paymentStatus: "paid",
    customerId: 4,
    items: [{ productId: 9, quantity: 2 }],
    metadata: {},
  });

  prisma.$transaction = async (callback) => {
    const tx = {
      order: {
        update: async ({ where, data }) => {
          assert.equal(where.id, 12);
          assert.equal(data.status, "refund_requested");
          assert.equal(data.metadata.refundReason, "Damaged item");
          return {
            id: 12,
            orderNumber: "ORD-12",
            status: "refund_requested",
            paymentStatus: "paid",
            metadata: data.metadata,
            customer: { id: 4 },
          };
        },
      },
      orderStatusHistory: { create: async (payload) => payload.data },
      orderNote: { create: async (payload) => payload.data },
      auditLog: { create: async (payload) => payload.data },
      product: { findUnique: async () => null },
      inventoryTransaction: { create: async () => null },
    };

    return callback(tx);
  };

  const created = await createRefundRequest(12, { reason: "Damaged item", note: "Customer requested refund", actor: { id: 3, type: "admin" } });

  assert.equal(created.status, "refund_requested");
  assert.equal(created.refundReason, "Damaged item");
  assert.equal(created.note.note, "Customer requested refund");
});
