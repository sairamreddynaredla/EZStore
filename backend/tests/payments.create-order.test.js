import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import createApp from "../src/app.js";

test("POST /api/payment/create-order rejects payment methods the server does not support", async () => {
  const server = createApp().listen(0);
  await once(server, "listening");

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/payment/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: 1, quantity: 1 }],
        totalAmount: 10,
        paymentMethod: "crypto_unsupported",
        customerEmail: "guest@example.com",
      }),
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.match(body.message, /Unsupported payment provider/i);
  } finally {
    server.close();
  }
});
