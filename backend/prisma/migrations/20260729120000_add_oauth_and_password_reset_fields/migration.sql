-- Migration: add oauth and password reset fields

BEGIN;

ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "emailVerificationToken" varchar;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "emailVerificationTokenSentAt" timestamptz;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "resetPasswordToken" varchar;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "resetPasswordTokenExpiresAt" timestamptz;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "refreshTokenHash" varchar;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" timestamptz;

COMMIT;
