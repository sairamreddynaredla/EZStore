-- Keep the deployed payment table compatible with the Stripe payment service.
-- IF NOT EXISTS lets this migration run safely on databases that already have
-- these columns from an earlier schema revision.
ALTER TABLE "Payment"
  ADD COLUMN IF NOT EXISTS "paymentIntentId" TEXT,
  ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;

CREATE TABLE IF NOT EXISTS "IdempotencyKey" (
  "id" SERIAL NOT NULL,
  "key" TEXT NOT NULL,
  "request" JSONB,
  "response" JSONB,
  "status" TEXT NOT NULL DEFAULT 'processing',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "IdempotencyKey_key_key"
  ON "IdempotencyKey"("key");
