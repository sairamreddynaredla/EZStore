# Stripe CLI Local Testing

1. Install and login to Stripe CLI

```bash
npm install -g stripe
stripe login
```

2. Forward webhook events to local backend

```bash
stripe listen --forward-to http://localhost:5000/api/payment/webhook
```

3. Create test PaymentIntent (example)

```bash
stripe payment_intents create --amount 500 --currency usd --payment_method_types[]=card
```

4. Use test cards (example):
- Success: 4242 4242 4242 4242
- 3D Secure required: 4000 0025 0000 3155
- Card declined: 4000 0000 0000 9995

5. Trigger webhook events

```bash
stripe trigger payment_intent.succeeded
stripe trigger charge.refunded
```

6. Verify local server logs show events processed and DB updated.

