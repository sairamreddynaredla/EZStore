import test from "node:test";
import assert from "node:assert/strict";
import requestContext from "../src/routes/middleware/requestContext.js";
import errorHandler from "../src/routes/middleware/errorHandler.js";
import sanitizeInput from "../src/routes/middleware/inputSanitizer.js";

test("requestContext adds a request id and exposes it on the response", () => {
  const req = { get: () => null };
  const headers = {};
  const res = {
    setHeader(name, value) {
      headers[name] = value;
    },
  };

  let nextCalled = false;
  requestContext(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(typeof req.requestId, "string");
  assert.equal(req.requestId.length > 0, true);
  assert.equal(headers["x-request-id"], req.requestId);
});

test("sanitizeInput strips HTML tags from string values recursively", () => {
  const req = {
    body: {
      firstName: "<script>alert('x')</script>Jane",
      nested: {
        note: "<b>Safe</b> note",
      },
    },
    query: {
      search: "<img src=x onerror=alert(1)>",
    },
    params: {
      id: "12",
    },
  };
  const res = {};

  let nextCalled = false;
  sanitizeInput(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.body.firstName, "Jane");
  assert.equal(req.body.nested.note, "Safe note");
  assert.equal(req.query.search, "");
  assert.equal(req.params.id, "12");
});

test("errorHandler returns a standard envelope with request context", () => {
  const req = { requestId: "req-123" };
  let statusCode = null;
  let responseBody = null;

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

  const err = Object.assign(new Error("Bad request"), { status: 400, code: "VALIDATION_ERROR" });
  errorHandler(err, req, res, () => {});

  assert.equal(statusCode, 400);
  assert.equal(responseBody.success, false);
  assert.equal(responseBody.message, "Bad request");
  assert.equal(responseBody.meta.requestId, "req-123");
  assert.equal(responseBody.meta.code, "VALIDATION_ERROR");
});
