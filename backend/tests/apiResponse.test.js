import test from "node:test";
import assert from "node:assert/strict";
import { buildErrorResponse, buildSuccessResponse } from "../src/utils/apiResponse.js";

test("buildSuccessResponse includes the standard success envelope", () => {
  const result = buildSuccessResponse({ id: 1 }, { message: "Created", meta: { total: 1 }, status: 201 });

  assert.equal(result.success, true);
  assert.equal(result.message, "Created");
  assert.deepEqual(result.data, { id: 1 });
  assert.deepEqual(result.meta, { total: 1 });
  assert.equal(result.status, 201);
});

test("buildErrorResponse includes the standard error envelope", () => {
  const result = buildErrorResponse("Bad request", { status: 400, code: "INVALID_INPUT", meta: { field: "email" } });

  assert.equal(result.success, false);
  assert.equal(result.message, "Bad request");
  assert.equal(result.data, null);
  assert.deepEqual(result.meta, { field: "email", code: "INVALID_INPUT", status: 400 });
});
