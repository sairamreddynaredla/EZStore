-- Synchronize the payment tables with the Prisma schema.

ALTER TABLE "Admin"
  ALTER COLUMN "resetPasswordToken" SET DATA TYPE TEXT,
  ALTER COLUMN "resetPasswordExpiresAt" SET DATA TYPE TIMESTAMP(3);

ALTER TABLE "Payment"
  ADD COLUMN "customerId" INTEGER,
  ADD COLUMN "paymentNumber" TEXT,
  ADD COLUMN "providerOrderId" TEXT;

CREATE TABLE "Transaction" (
  "id" SERIAL NOT NULL,
  "transactionId" TEXT NOT NULL,
  "paymentId" INTEGER NOT NULL,
  "orderId" INTEGER NOT NULL,
  "provider" TEXT NOT NULL,
  "providerTransactionId" TEXT,
  "type" TEXT NOT NULL DEFAULT 'charge',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "gatewayResponse" JSONB,
  "errorCode" TEXT,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Refund" (
  "id" SERIAL NOT NULL,
  "refundNumber" TEXT NOT NULL,
  "paymentId" INTEGER NOT NULL,
  "orderId" INTEGER NOT NULL,
  "provider" TEXT NOT NULL,
  "providerRefundId" TEXT,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "reason" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WebhookLog" (
  "id" SERIAL NOT NULL,
  "provider" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "payload" JSONB,
  "status" TEXT NOT NULL DEFAULT 'processing',
  "errorMessage" TEXT,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),

  CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Transaction_transactionId_key" ON "Transaction"("transactionId");
CREATE UNIQUE INDEX "Refund_refundNumber_key" ON "Refund"("refundNumber");
CREATE UNIQUE INDEX "WebhookLog_eventId_key" ON "WebhookLog"("eventId");
CREATE UNIQUE INDEX "Payment_paymentNumber_key" ON "Payment"("paymentNumber");

ALTER TABLE "Payment"
  ADD CONSTRAINT "Payment_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Transaction"
  ADD CONSTRAINT "Transaction_paymentId_fkey"
  FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Refund"
  ADD CONSTRAINT "Refund_paymentId_fkey"
  FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
