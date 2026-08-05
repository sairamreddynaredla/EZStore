# Payment Production Checklist

- Environment Variables
  - `DATABASE_URL`
  - `JWT_SECRET` / `JWT_REFRESH_SECRET`
  - `FRONTEND_URL`
  - `STRIPE_SECRET_KEY` (live key)
  - `STRIPE_WEBHOOK_SECRET` (from Stripe dashboard)
  - `NODE_ENV=production`

- Webhook setup
  - Register webhook endpoint: `https://<your-backend>/api/payment/webhook`
  - Subscribe to events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.processing`, `charge.refunded`, `charge.dispute.created`
  - Copy `STRIPE_WEBHOOK_SECRET` into backend env

- Stripe Dashboard
  - Verify your business details and bank account
  - Enable required payment methods (Cards, wallets) and balances

- Security
  - HTTPS enforced for backend and frontend
  - CORS configured to only allow frontend origin(s)
  - `BACKEND_URL` and `FRONTEND_URL` correct

- Testing
  - Run end-to-end tests with Stripe test cards
  - Use Stripe CLI to forward webhooks during local testing
  - Test refunds and disputes flows

- Monitoring
  - Set up logging/alerts for webhook failures and refund errors
  - Ensure metrics for payment success/failure rates

