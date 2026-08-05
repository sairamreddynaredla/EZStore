import test from "node:test";
import assert from "node:assert/strict";
import { computeOrderSubtotal } from "../src/services/shared/priceCalculator.js";

test("computeOrderSubtotal uses product price when no variants", () => {
  const products = [{ id: 1, price: 10.0, metadata: {} }, { id: 2, price: 5.5, metadata: {} }];
  const items = [{ id: 1, quantity: 2 }, { id: 2, quantity: 3 }];
  const subtotal = computeOrderSubtotal(items, products);
  assert.equal(subtotal, 10.0 * 2 + 5.5 * 3);
});

test("computeOrderSubtotal prefers variant price when variant matches", () => {
  const products = [
    { id: 1, price: 20.0, metadata: { variants: [{ weight: "500g", price: 15.0 }, { weight: "1kg", price: 28.0 }] } },
  ];
  const items = [{ id: 1, quantity: 2, selectedVariant: { weight: "500g" } }];
  const subtotal = computeOrderSubtotal(items, products);
  assert.equal(subtotal, 15.0 * 2);
});

test("computeOrderSubtotal throws when product missing", () => {
  const products = [{ id: 1, price: 10.0, metadata: {} }];
  const items = [{ id: 2, quantity: 1 }];
  try {
    computeOrderSubtotal(items, products);
    assert.fail("Expected error");
  } catch (err) {
    assert.ok(err.message.includes("Product not found"));
  }
});
