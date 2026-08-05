# Stripe webhook setup

Run the backend on port 3000, then use the Stripe CLI:

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

In this application the compatible payment webhook paths are `/api/payment/webhook` and `/api/payment/webhook/stripe`. If the backend runs on its default port, use:

```bash
stripe listen --forward-to http://localhost:5000/api/payment/webhook
```

Copy the `whsec_...` value output by the CLI into `STRIPE_WEBHOOK_SECRET`. Configure Stripe to send at least `payment_intent.succeeded` and `payment_intent.payment_failed`; `checkout.session.completed` is also safely recognized.
