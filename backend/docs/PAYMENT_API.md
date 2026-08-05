# Stripe Payment API

EZStore supports Stripe card payments only. The server creates a Stripe PaymentIntent and returns its client secret to the browser. The browser confirms it with Stripe.js; the server marks an order paid only after Stripe sends a signed webhook.

## Endpoints

- `GET /api/payment/config` returns `stripeEnabled`, the Stripe publishable key, and the default currency.
- `POST /api/payment/create-order` creates a pending order and a Stripe PaymentIntent. Send an `Idempotency-Key` header to safely retry a request.
- `POST /api/payment/webhook` (or `/api/payment/webhook/stripe`) receives signed Stripe events. This endpoint is the sole payment-status authority.

The create-order response contains `data.stripe.clientSecret` and `data.stripe.paymentIntentId`. Never expose `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` to the browser.
