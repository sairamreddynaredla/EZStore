import test from "node:test";
import assert from "node:assert/strict";
import { validateRequest } from "../src/middleware/validateRequest.js";
import { adminIdParamSchema, adminLoginSchema, adminUserCreateSchema, adminUserListQuerySchema, adminUserUpdateSchema } from "../src/validators/admin.js";

test("adminLoginSchema rejects invalid login payloads", () => {
  const result = adminLoginSchema.safeParse({ email: "not-an-email", password: "12" });

  assert.equal(result.success, false);
  assert.match(result.error.issues[0].message, /email|password/i);
});

test("adminUserCreateSchema accepts valid admin payloads", () => {
  const result = adminUserCreateSchema.safeParse({
    name: "Jamie Doe",
    email: "jamie@example.com",
    password: "strongPassword123",
    role: "admin",
    status: "active",
  });

  assert.equal(result.success, true);
  assert.equal(result.data.email, "jamie@example.com");
});

test("adminUserUpdateSchema permits partial updates", () => {
  const result = adminUserUpdateSchema.safeParse({ role: "super_admin" });

  assert.equal(result.success, true);
  assert.equal(result.data.role, "super_admin");
});

test("adminUserUpdateSchema allows empty password values for edits", () => {
  const result = adminUserUpdateSchema.safeParse({ password: "" });

  assert.equal(result.success, true);
});

test("adminUserListQuerySchema rejects invalid pagination and sort values", () => {
  const result = adminUserListQuerySchema.safeParse({ page: 0, limit: -1, sortBy: "unknown", order: "up", role: "manager", status: "archived" });

  assert.equal(result.success, false);
  assert.match(result.error.issues.map((issue) => issue.message).join(" "), /page|limit|sortBy|order|role|status/i);
});

test("validateRequest validates params and query data when provided", () => {
  const req = {
    body: {},
    params: { adminId: "invalid" },
    query: { page: 0, order: "up" },
  };
  const res = {
    status(code) {
      this.code = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
  let nextCalled = false;

  validateRequest({ params: adminIdParamSchema, query: adminUserListQuerySchema })(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.code, 400);
  assert.equal(res.body.success, false);
});
