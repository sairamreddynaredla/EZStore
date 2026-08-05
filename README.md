# EZStore

## Stripe payments

Stripe is mandatory: the backend will refuse to start unless all Stripe variables are valid. Create an account at [Stripe](https://dashboard.stripe.com/register), switch to Test mode, and create `backend/.env` from `backend/.env.example`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Set `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...` in the frontend environment. This is the only Stripe key permitted in the frontend; never expose the secret or webhook key.

Install the [Stripe CLI](https://docs.stripe.com/stripe-cli), log in, and forward test events to the backend:

```bash
stripe listen --forward-to http://localhost:5000/api/stripe/webhook
```

For the repository's default backend port, use `http://localhost:5000/api/payment/webhook` instead. Copy the resulting `whsec_...` value into `STRIPE_WEBHOOK_SECRET`, restart the backend, then use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC, and any postal code. Payment status changes only after the signed webhook arrives.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
