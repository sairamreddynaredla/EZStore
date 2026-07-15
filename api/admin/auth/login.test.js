import test from "node:test";
import assert from "node:assert/strict";
import handler from "./login.js";

function createResponse() {
  const headers = {};

  return {
    headers,
    statusCode: 200,
    setHeader(name, value) {
      headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("admin login handler reflects an allowed remote origin", async () => {
  process.env.ALLOWED_ORIGINS = "https://petstore.example.com";

  const req = {
    method: "OPTIONS",
    headers: {
      origin: "https://petstore.example.com",
      host: "petstore.example.com",
    },
  };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 204);
  assert.equal(res.headers["Access-Control-Allow-Origin"], "https://petstore.example.com");
});
