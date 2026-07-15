import test from "node:test";
import assert from "node:assert/strict";
import { resolveStockUpdate } from "../src/services/shared/inventoryUpdate.js";

test("resolveStockUpdate sets an absolute stock value", () => {
  const result = resolveStockUpdate(5, { stock: 20, reason: "Initial restock" });

  assert.equal(result.stock, 20);
  assert.equal(result.change, 15);
  assert.equal(result.type, "set");
  assert.equal(result.reason, "Initial restock");
});

test("resolveStockUpdate adjusts stock by delta for increase and decrease operations", () => {
  const increase = resolveStockUpdate(5, { type: "increase", stockDelta: 3, reason: "Supplier delivery" });
  const decrease = resolveStockUpdate(5, { type: "decrease", stockDelta: 3, reason: "Damaged unit" });

  assert.equal(increase.stock, 8);
  assert.equal(increase.change, 3);
  assert.equal(increase.type, "increase");
  assert.equal(increase.reason, "Supplier delivery");

  assert.equal(decrease.stock, 2);
  assert.equal(decrease.change, -3);
  assert.equal(decrease.type, "decrease");
  assert.equal(decrease.reason, "Damaged unit");
});
