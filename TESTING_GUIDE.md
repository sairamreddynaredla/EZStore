# Payment System Testing Instructions

This guide covers testing the multi-provider payment system in both **Demo Mode** and **Live/Sandbox Gateway Mode**.

---

## 1. Testing in Demo Mode (No API keys required)
1. In `backend/.env`, set:
   ```env
   DEMO_MODE=true
   ```
2. Start backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Open `http://localhost:5173/payment` in browser.
4. Select any provider (Stripe / Razorpay / PayPal).
5. Click **Pay Securely**.
6. System will simulate successful payment order creation and redirect to `/payment/success`.

---

## 2. Testing with Provider Credentials

### Stripe
- Use test cards (e.g., `4242 4242 4242 4242`, CVC `123`, Future Date).

### Razorpay
- Use Razorpay Test Key ID & Secret.
- Select Razorpay payment method; the Razorpay modal will open up with test UPI and Netbanking options.

### PayPal
- Use PayPal Sandbox buyer account credentials (`buyer@personal.example.com`).

---

## 3. Verifying Idempotency
- Send duplicate request with header `Idempotency-Key: test-uuid-1234`.
- The second request will return cached reservation or order without duplicating DB records or PaymentIntents.
