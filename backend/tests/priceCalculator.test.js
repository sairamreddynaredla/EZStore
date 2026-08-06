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

test("computeOrderSubtotal supports order item productId when id is absent", () => {
  const products = [{ id: 104, price: 12.5, metadata: {}, slug: "test-product" }];
  const items = [{ productId: 104, quantity: 2 }];
  const subtotal = computeOrderSubtotal(items, products);
  assert.equal(subtotal, 12.5 * 2);
});

test("computeOrderSubtotal supports order item productSlug when id is absent", () => {
  const products = [{ id: 105, price: 8.0, metadata: {}, slug: "product-105" }];
  const items = [{ productSlug: "product-105", quantity: 3 }];
  const subtotal = computeOrderSubtotal(items, products);
  assert.equal(subtotal, 8.0 * 3);
});

test("computeOrderSubtotal falls back to the product slug when a frontend ID is stale", () => {
  const products = [{ id: 3, price: 28.99, metadata: {}, slug: "purina-pro-plan-complete-essentials-adult-dry-dog-food" }];
  const items = [{ productId: 103, productSlug: "purina-pro-plan-complete-essentials-adult-dry-dog-food", quantity: 1 }];

  assert.equal(computeOrderSubtotal(items, products), 28.99);
});
