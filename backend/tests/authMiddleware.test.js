import test from "node:test";
import assert from "node:assert/strict";
import { requireAdmin } from "../src/middleware/requireAdmin.js";

test("requireAdmin rejects users without an admin role", () => {
  const req = { user: { id: 1, email: "viewer@example.com", role: "viewer" } };
  let statusCode = null;
  let responseBody = null;
  let nextCalled = false;

  const res = {
    status(code) {
      statusCode = code;
      return {
        json(body) {
          responseBody = body;
        },
      };
    },
  };

  requireAdmin(req, res, () => {
    nextCalled = true;
  });

  assert.equal(statusCode, 403);
  assert.equal(nextCalled, false);
  assert.deepEqual(responseBody, { success: false, message: "Forbidden" });
});

test("requireAdmin allows admin and super_admin roles", () => {
  const adminReq = { user: { id: 2, email: "admin@example.com", role: "admin" } };
  const superAdminReq = { user: { id: 3, email: "super@example.com", role: "super_admin" } };
  let nextCalls = 0;

  const passThrough = () => {
    nextCalls += 1;
  };

  requireAdmin(adminReq, {}, passThrough);
  requireAdmin(superAdminReq, {}, passThrough);

  assert.equal(nextCalls, 2);
});
