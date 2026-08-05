-- Bring deployed databases in line with the current catalog and customer models.

ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS "trackInventory" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Customer"
  ADD COLUMN IF NOT EXISTS "provider" TEXT NOT NULL DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS "googleId" TEXT,
  ADD COLUMN IF NOT EXISTS "avatar" TEXT,
  ADD COLUMN IF NOT EXISTS "providerId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Customer_googleId_key" ON "Customer"("googleId");
