# Stripe webhook setup

Run the backend on its default port, then use the Stripe CLI:

```bash
stripe listen --forward-to http://localhost:5000/api/payment/webhook
```

Copy the `whsec_...` value output by the CLI into `STRIPE_WEBHOOK_SECRET`. Configure Stripe to send at least `payment_intent.succeeded` and `payment_intent.payment_failed`; `checkout.session.completed` is also safely recognized.
