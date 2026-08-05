import test from "node:test";
import assert from "node:assert/strict";
import { getCartItemImage, normalizeCartItem, buildCartItemPayload } from "./cartItemUtils.js";

test("getCartItemImage prefers productImage and falls back consistently", () => {
  const item = {
    productImage: "https://example.com/image-product.jpg",
    image: "https://example.com/image.jpg",
    imageUrl: "https://example.com/image-url.jpg",
    product: { imageUrl: "https://example.com/product-image-url.jpg", image: "https://example.com/product-image.jpg" },
    images: ["https://example.com/gallery.jpg"],
  };

  assert.equal(getCartItemImage(item), item.productImage);
});

test("getCartItemImage falls back to imageUrl, product image, or gallery images", () => {
  assert.equal(getCartItemImage({ image: "i1" }), "i1");
  assert.equal(getCartItemImage({ imageUrl: "i2" }), "i2");
  assert.equal(getCartItemImage({ product: { imageUrl: "i3" } }), "i3");
  assert.equal(getCartItemImage({ images: ["i4"] }), "i4");
});

test("normalizeCartItem preserves image and productImage consistently", () => {
  const item = {
    productId: 3,
    productName: "Snack",
    imageUrl: "https://example.com/image-url.jpg",
    quantity: 2,
    selectedVariant: { weight: "250g", price: 6 },
  };

  const normalized = normalizeCartItem(item);

  assert.equal(normalized.image, item.imageUrl);
  assert.equal(normalized.productImage, item.imageUrl);
  assert.equal(normalized.id, 3);
  assert.equal(normalized.productId, 3);
  assert.equal(normalized.name, "Snack");
  assert.equal(normalized.price, 6);
});

test("buildCartItemPayload includes productImage and image payload fields", () => {
  const item = {
    id: 4,
    name: "Crunch",
    image: "https://example.com/image.jpg",
    quantity: 1,
    selectedVariant: { weight: "500g", price: 10 },
  };

  const payload = buildCartItemPayload(item);

  assert.equal(payload.productImage, item.image);
  assert.equal(payload.image, item.image);
  assert.equal(payload.productId, 4);
  assert.equal(payload.productName, "Crunch");
  assert.equal(payload.variantKey, "500g");
});
