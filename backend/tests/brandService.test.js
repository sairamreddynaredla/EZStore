import test from "node:test";
import assert from "node:assert/strict";
import { createBrand, deleteBrand, getBrand, getBrands, updateBrand } from "../src/services/admin/brandService.js";

test("admin brand service exposes CRUD helpers", () => {
  assert.equal(typeof getBrands, "function");
  assert.equal(typeof getBrand, "function");
  assert.equal(typeof createBrand, "function");
  assert.equal(typeof updateBrand, "function");
  assert.equal(typeof deleteBrand, "function");
});
