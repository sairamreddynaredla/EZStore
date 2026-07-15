import test from "node:test";
import assert from "node:assert/strict";
import { validatePasswordPolicy } from "../src/utils/passwordPolicy.js";

test("validatePasswordPolicy rejects weak passwords", () => {
  assert.equal(validatePasswordPolicy("weak"), "Password must be at least 8 characters long");
  assert.equal(validatePasswordPolicy("weakpass1"), "Password must contain at least one uppercase letter");
  assert.equal(validatePasswordPolicy("WEAKPASS1"), "Password must contain at least one lowercase letter");
  assert.equal(validatePasswordPolicy("WeakPass"), "Password must contain at least one number");
  assert.equal(validatePasswordPolicy("WeakPass1"), "Password must contain at least one special character");
});

test("validatePasswordPolicy accepts strong passwords", () => {
  assert.equal(validatePasswordPolicy("StrongPass1!"), null);
});
