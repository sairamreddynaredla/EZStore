import crypto from "crypto";

/**
 * Generate a cryptographically unique order number
 * Format: ORD-YYYYMMDD-HEX8
 */
export const generateOrderNumber = () => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ORD-${timestamp}-${randomHex}`;
};

/**
 * Generate a unique payment number
 * Format: PAY-YYYYMMDD-HEX8
 */
export const generatePaymentNumber = () => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `PAY-${timestamp}-${randomHex}`;
};

/**
 * Generate a unique transaction ID
 * Format: TXN-YYYYMMDD-HEX8
 */
export const generateTransactionId = () => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `TXN-${timestamp}-${randomHex}`;
};

/**
 * Generate a unique refund number
 * Format: RFD-YYYYMMDD-HEX8
 */
export const generateRefundNumber = () => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `RFD-${timestamp}-${randomHex}`;
};
