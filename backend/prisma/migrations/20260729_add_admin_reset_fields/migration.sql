-- Migration: add reset password fields to Admin

BEGIN;

ALTER TABLE "Admin" ADD COLUMN IF NOT EXISTS "resetPasswordToken" varchar;
ALTER TABLE "Admin" ADD COLUMN IF NOT EXISTS "resetPasswordExpiresAt" timestamptz;

COMMIT;
