This document covers the password reset feature: migration, SMTP setup, and verification steps.

1) Run Prisma migration

- For development (interactive):

```bash
cd backend
cp .env.example .env   # update DATABASE_URL and APP_URL
npm install
npx prisma migrate dev --name add-admin-reset-fields
```

- For production (non-interactive):

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma generate
```

2) SMTP configuration (Nodemailer)

The app supports any SMTP provider. Add to `.env`:

- `SMTP_HOST` (e.g. smtp.gmail.com, smtp-relay.sendinblue.com, smtp.mailtrap.io)
- `SMTP_PORT` (465 for secure Gmail app password, 587 for TLS)
- `SMTP_USER` (SMTP username)
- `SMTP_PASS` (SMTP password or app password)
- `SMTP_SECURE` (true/false)
- `MAIL_FROM` (optional, defaults to no-reply@<backend-hostname>)

Examples:

- Gmail (App Password):
  - SMTP_HOST=smtp.gmail.com
  - SMTP_PORT=465
  - SMTP_USER=your-email@gmail.com
  - SMTP_PASS=your_app_password
  - SMTP_SECURE=true

- Brevo (Sendinblue):
  - SMTP_HOST=smtp-relay.sendinblue.com
  - SMTP_PORT=587
  - SMTP_USER=your_smtp_user
  - SMTP_PASS=your_smtp_password
  - SMTP_SECURE=false

- Mailtrap (testing):
  - SMTP_HOST=smtp.mailtrap.io
  - SMTP_PORT=2525
  - SMTP_USER=your_mailtrap_user
  - SMTP_PASS=your_mailtrap_pass
  - SMTP_SECURE=false

If SMTP is not configured, the backend will log the full reset URL to the console for demo/testing.

3) How the flow works

- `POST /api/admin/auth/forgot-password` accepts `{ email }` and always returns a generic success message to prevent email enumeration.
- If the email exists, the server generates a cryptographically secure token, stores only the SHA-256 hash in the DB, and sets an expiry 15 minutes in the future.
- An email with a branded HTML template and a reset link (using `APP_URL` / `FRONTEND_URL`) is sent to the user. If SMTP is missing, the reset URL is logged to the server console.
- `POST /api/admin/auth/reset-password` accepts `{ token, password }`. The token is hashed and matched to the stored hash; expiry is validated. On success, the admin password is bcrypt hashed and the token fields are cleared.

4) Rate limiting

- The forgot-password endpoint is rate-limited to 5 requests per 15 minutes per IP. Adjust `src/routes/middleware/rateLimit.js` if needed.

5) Frontend

- The admin UX includes `ForgotPassword` and `ResetPassword` pages. The reset page validates password strength (min 8 chars, uppercase, number, special char recommended) and disables submit until acceptable.

6) Manual E2E verification steps

- Start backend with `.env` configured and DB migrated.
- Start frontend (ensure `APP_URL` is set to frontend host in backend `.env`).

Flow:

1. Visit the admin login page and click "Forgot password".
2. Enter a valid admin email, submit.
3. Check SMTP inbox (or backend console) for the reset link.
4. Open the reset link, provide a new strong password.
5. Submit — you should receive a success message and be redirected to sign in.
6. Attempt login with the new password to verify.

7) Security notes

- Tokens are generated via `crypto.randomBytes(48)`, then hashed with SHA-256 before storing.
- Passwords are hashed using `bcrypt` with a cost of 12.
- Responses are intentionally generic to avoid user/email enumeration.
- Reset tokens are single-use and expire after 15 minutes.

If you want, I can:
- Run the migration locally (I need a DB URL and permission), or
- Add a small test harness to simulate the flow automatically.

*** End of document ***
