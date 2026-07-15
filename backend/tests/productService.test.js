import test from "node:test";
import assert from "node:assert/strict";
import { buildInventoryHistoryResponse } from "../src/services/shared/productService.js";

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
