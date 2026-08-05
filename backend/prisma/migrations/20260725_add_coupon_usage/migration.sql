-- Migration: add coupon usage table and extra coupon fields

BEGIN;

-- Add new columns to Coupon
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "startsAt" timestamptz;
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "perUserLimit" integer;
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "minOrderAmount" double precision NOT NULL DEFAULT 0;
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "maxDiscount" double precision;
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "applicableProducts" jsonb;
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "excludedProducts" jsonb;
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "applicableCategories" jsonb;
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "excludedCategories" jsonb;
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "firstOrderOnly" boolean NOT NULL DEFAULT false;
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "freeShipping" boolean NOT NULL DEFAULT false;

-- Create CouponUsage table
CREATE TABLE IF NOT EXISTS "CouponUsage" (
  "id" serial PRIMARY KEY,
  "couponId" integer NOT NULL,
  "customerId" integer,
  "orderId" integer,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "CouponUsage_coupon_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"(id) ON DELETE CASCADE,
  CONSTRAINT "CouponUsage_customer_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"(id) ON DELETE SET NULL,
  CONSTRAINT "CouponUsage_order_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "CouponUsage_couponId_idx" ON "CouponUsage" ("couponId");
CREATE INDEX IF NOT EXISTS "CouponUsage_customerId_idx" ON "CouponUsage" ("customerId");
ALTER TABLE "CouponUsage" ADD CONSTRAINT IF NOT EXISTS "CouponUsage_coupon_customer_order_unique" UNIQUE ("couponId", "customerId", "orderId");

COMMIT;
