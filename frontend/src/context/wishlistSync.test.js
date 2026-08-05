import test from "node:test";
import assert from "node:assert/strict";
import { mergeWishlistItems } from "./wishlistSync.js";

test("mergeWishlistItems merges guest and remote items without duplicates", () => {
  const guestItems = [{ id: 10, name: "Dog Bed", price: 40 }];
  const remoteItems = [
    { productId: 11, productName: "Treat Pack", unitPrice: 12 },
    { id: 51, productId: 10, productName: "Dog Bed", unitPrice: 40 },
  ];

  const merged = mergeWishlistItems(guestItems, remoteItems);

  assert.equal(merged.length, 2);
  assert.deepEqual(merged.map((item) => item.id), [10, 11]);
  assert.equal(merged.find((item) => item.id === 10).wishlistItemId, 51);
});

test("mergeWishlistItems removes duplicate items stored locally", () => {
  const merged = mergeWishlistItems([
    { id: 10, name: "Dog Bed", price: 40 },
    { id: "10", name: "Dog Bed", price: 40 },
  ]);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, 10);
  assert.equal(merged[0].wishlistItemId, undefined);
});
