Migration: add_coupon_usage

Description:
- Adds new nullable fields to `Coupon` for advanced validation and applicability.
- Creates `CouponUsage` table to track per-order and per-customer coupon redemptions.

Rollback considerations:
- Dropping columns will remove stored coupon configuration and may break business rules; backup data before rollback.
- To rollback safely:
  1. Disable application code that relies on the new fields.
  2. Run SQL to drop the `CouponUsage` table and remove added columns from `Coupon`.

Rollback SQL (example):

BEGIN;
DROP TABLE IF EXISTS "CouponUsage";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "startsAt";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "perUserLimit";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "minOrderAmount";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "maxDiscount";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "applicableProducts";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "excludedProducts";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "applicableCategories";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "excludedCategories";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "firstOrderOnly";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "freeShipping";
COMMIT;

Notes:
- If you need to preserve historical coupon usages, export `CouponUsage` before dropping the table.
- Consider writing a migration that backfills `minOrderAmount` and other fields for existing coupons if necessary.
