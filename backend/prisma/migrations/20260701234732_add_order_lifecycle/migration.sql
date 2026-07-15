-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "refundCompletedAt" TIMESTAMP(3),
ADD COLUMN     "refundReason" TEXT,
ADD COLUMN     "refundRequestedAt" TIMESTAMP(3),
ADD COLUMN     "shippingProvider" TEXT,
ADD COLUMN     "trackingNumber" TEXT;

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "paymentStatus" TEXT,
    "actorType" TEXT,
    "actorId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderNote" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "authorType" TEXT NOT NULL DEFAULT 'admin',
    "authorId" INTEGER,
    "note" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderNote" ADD CONSTRAINT "OrderNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
