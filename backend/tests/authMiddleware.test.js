import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { requireAdmin } from "../src/routes/middleware/requireAdmin.js";
import config from "../src/config/index.js";
import { optionalJwtAuth } from "../src/routes/middleware/jwtAuth.js";

test("optionalJwtAuth attaches a verified customer when a token is provided", () => {
  const user = { id: 42, email: "customer@example.com", role: "customer" };
  const token = jwt.sign(user, config.JWT_SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } };
  let nextCalled = false;

  optionalJwtAuth(req, {}, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.id, user.id);
  assert.equal(req.user.email, user.email);
  assert.equal(req.user.role, user.role);
});

test("optionalJwtAuth permits checkout without a token", () => {
  let nextCalled = false;

  optionalJwtAuth({ headers: {} }, {}, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});

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
