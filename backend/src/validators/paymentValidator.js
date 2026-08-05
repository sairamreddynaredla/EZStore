import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive().optional(),
  id: z.coerce.number().int().positive("Valid product id is required").optional(),
  productSlug: z.string().trim().optional(),
  productName: z.string().trim().optional(),
  quantity: z.coerce.number().int().positive().optional().default(1),
  price: z.coerce.number().optional(),
  unitPrice: z.coerce.number().optional(),
  selectedVariant: z.any().optional(),
}).superRefine((item, ctx) => {
  if (!item.id && !item.productSlug && !item.productName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either product id, product slug or product name is required",
      path: ["id"],
    });
  }
});

export const orderCreateSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  totalAmount: z.coerce.number().nonnegative("Order total amount must be non-negative"),
  couponCode: z.string().trim().optional(),
  shippingAddress: z
    .object({
      label: z.string().trim().optional(),
      recipientName: z.string().trim().optional(),
      fullName: z.string().trim().optional(),
      phone: z.string().trim().optional(),
      street: z.string().trim().optional(),
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      postalCode: z.string().trim().optional(),
      country: z.string().trim().optional(),
    })
    .optional(),
  customerEmail: z.string().trim().email("Valid email is required").optional(),
  customerName: z.string().trim().optional(),
  customerPhone: z.string().trim().optional(),
  paymentMethod: z.string().trim().min(1, "Payment method is required"),
  currency: z.string().trim().optional().default("USD"),
  metadata: z.record(z.any()).optional(),
});

export const paymentVerifySchema = z.object({
  orderId: z.coerce.number().int().positive().optional(),
  provider: z.string().trim().optional(),
  providerOrderId: z.string().trim().optional(),
  providerPaymentId: z.string().trim().optional(),
  providerSignature: z.string().trim().optional(),
  paymentIntentId: z.string().trim().optional(),
});

export const refundSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  reason: z.string().trim().optional(),
});

export const paymentIdParamSchema = z.object({
  paymentId: z.coerce.number().int().positive(),
});

export const orderIdParamSchema = z.object({
  orderId: z.coerce.number().int().positive(),
});
