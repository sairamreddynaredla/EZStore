import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";
import {
  clearCart,
  createReview,
  listCartItems,
  listRecentlyViewedItems,
  listReviews,
  listSavedItems,
  listWishlistItems,
  removeCartItem,
  removeWishlistItem,
  upsertCartItem,
  upsertRecentlyViewedItem,
  upsertSavedItem,
  toggleWishlistItem,
  updateCartItemQuantity,
} from "../../services/user/customerCommerceService.js";
import { z } from "zod";
import couponService from "../../services/shared/couponService.js";

const router = express.Router();

const cartItemSchema = z.object({
  productId: z.coerce.number().int().positive("Product ID is required").optional(),
  wishlistItemId: z.coerce.number().int().positive("Wishlist item ID is required").optional(),
  productSlug: z.string().trim().min(1).optional(),
  productName: z.string().trim().min(1, "Product name is required").optional(),
  productImage: z.string().trim().optional().or(z.literal("")).nullable(),
  price: z.coerce.number().nonnegative().optional(),
  unitPrice: z.coerce.number().nonnegative().optional(),
  quantity: z.coerce.number().int().min(1).default(1),
  variantKey: z.string().trim().optional().or(z.literal("")),
  selectedVariant: z.any().optional(),
}).superRefine((data, ctx) => {
  if (!data.productId && !data.wishlistItemId && (!data.productSlug || !data.productSlug.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either productId, wishlistItemId or productSlug is required",
      path: ["productId"],
    });
  }
});

const quantitySchema = z.object({ quantity: z.coerce.number().int().min(1, "Quantity must be at least 1") });
const couponValidationSchema = z.object({
  code: z.string().trim().min(1, "Coupon code is required"),
  subtotal: z.coerce.number().nonnegative(),
  items: z.array(z.object({ id: z.coerce.number().int().positive().optional(), productId: z.coerce.number().int().positive().optional() })).default([]),
});
const reviewSchema = z.object({
  productId: z.coerce.number().int().positive("Product ID is required"),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional().or(z.literal("")),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
});

router.get("/cart", jwtAuth, async (req, res, next) => {
  try {
    const items = await listCartItems(req.user.id);
    return sendSuccess(res, { items }, { message: "Cart loaded" });
  } catch (error) {
    return next(error);
  }
});

router.post("/coupons/validate", jwtAuth, validateRequest({ body: couponValidationSchema }), async (req, res, next) => {
  try {
    const result = await couponService.validateAndComputeCoupon({
      code: req.body.code,
      customerId: req.user.id,
      subtotal: req.body.subtotal,
      items: req.body.items,
    });
    return sendSuccess(res, {
      coupon: { code: result.coupon.code, description: result.coupon.description, freeShipping: result.coupon.freeShipping },
      discountAmount: result.discountAmount,
    }, { message: "Coupon applied" });
  } catch (error) {
    return next(error);
  }
});

router.post("/cart", jwtAuth, validateRequest(cartItemSchema), async (req, res, next) => {
  try {
    const item = await upsertCartItem(req.user.id, req.body);
    return sendSuccess(res, { item }, { message: "Item added to cart" });
  } catch (error) {
    return next(error);
  }
});

router.patch("/cart/:itemId", jwtAuth, validateRequest({ body: quantitySchema, params: z.object({ itemId: z.string().trim().min(1) }) }), async (req, res, next) => {
  try {
    const item = await updateCartItemQuantity(req.user.id, req.params.itemId, req.body.quantity);
    return sendSuccess(res, { item }, { message: "Cart updated" });
  } catch (error) {
    return next(error);
  }
});

router.delete("/cart/:itemId", jwtAuth, async (req, res, next) => {
  try {
    const result = await removeCartItem(req.user.id, req.params.itemId);
    return sendSuccess(res, { result }, { message: "Cart item removed" });
  } catch (error) {
    return next(error);
  }
});

router.delete("/cart", jwtAuth, async (req, res, next) => {
  try {
    const result = await clearCart(req.user.id);
    return sendSuccess(res, { result }, { message: "Cart cleared" });
  } catch (error) {
    return next(error);
  }
});

router.get("/wishlist", jwtAuth, async (req, res, next) => {
  try {
    const items = await listWishlistItems(req.user.id);
    return sendSuccess(res, { items }, { message: "Wishlist loaded" });
  } catch (error) {
    return next(error);
  }
});

router.post("/wishlist", jwtAuth, validateRequest(cartItemSchema), async (req, res, next) => {
  try {
    const result = await toggleWishlistItem(req.user.id, req.body);
    return sendSuccess(res, { result }, { message: result.action === "added" ? "Added to wishlist" : "Removed from wishlist" });
  } catch (error) {
    return next(error);
  }
});

router.delete("/wishlist/:wishlistItemId", jwtAuth, validateRequest({ params: z.object({ wishlistItemId: z.coerce.number().int().positive("Wishlist item ID is required") }) }), async (req, res, next) => {
  try {
    const result = await removeWishlistItem(req.user.id, req.params.wishlistItemId);
    return sendSuccess(res, { result }, { message: "Wishlist item removed" });
  } catch (error) {
    return next(error);
  }
});

router.post("/wishlist/add", jwtAuth, validateRequest(cartItemSchema), async (req, res, next) => {
  try {
    const result = await toggleWishlistItem(req.user.id, req.body, { ensurePresent: true });
    return sendSuccess(res, { result }, { message: "Item saved to wishlist" });
  } catch (error) {
    return next(error);
  }
});

router.get("/saved", jwtAuth, async (req, res, next) => {
  try {
    const items = await listSavedItems(req.user.id);
    return sendSuccess(res, { items }, { message: "Saved items loaded" });
  } catch (error) {
    return next(error);
  }
});

router.post("/saved", jwtAuth, validateRequest(cartItemSchema), async (req, res, next) => {
  try {
    const item = await upsertSavedItem(req.user.id, req.body);
    return sendSuccess(res, { item }, { message: "Saved for later" });
  } catch (error) {
    return next(error);
  }
});

router.get("/recently-viewed", jwtAuth, async (req, res, next) => {
  try {
    const items = await listRecentlyViewedItems(req.user.id);
    return sendSuccess(res, { items }, { message: "Recently viewed loaded" });
  } catch (error) {
    return next(error);
  }
});

router.post("/recently-viewed", jwtAuth, validateRequest(cartItemSchema), async (req, res, next) => {
  try {
    const item = await upsertRecentlyViewedItem(req.user.id, req.body);
    return sendSuccess(res, { item }, { message: "Recently viewed updated" });
  } catch (error) {
    return next(error);
  }
});

router.get("/reviews", jwtAuth, async (req, res, next) => {
  try {
    const result = await listReviews(req.user.id, req.query);
    return sendSuccess(res, result, { message: "Reviews loaded" });
  } catch (error) {
    return next(error);
  }
});

router.post("/reviews", jwtAuth, validateRequest(reviewSchema), async (req, res, next) => {
  try {
    const result = await createReview(req.user.id, req.body);
    return sendSuccess(res, result, { message: "Review submitted" }, 201);
  } catch (error) {
    if (error?.status === 409) {
      return sendError(res, error.message, { status: 409 });
    }
    return next(error);
  }
});

export default router;
