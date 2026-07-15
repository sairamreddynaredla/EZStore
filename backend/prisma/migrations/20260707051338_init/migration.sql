-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "variantKey" TEXT,
    "selectedVariant" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedItem" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "productPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentlyViewedItem" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "productPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentlyViewedItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentlyViewedItem" ADD CONSTRAINT "RecentlyViewedItem_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentlyViewedItem" ADD CONSTRAINT "RecentlyViewedItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
