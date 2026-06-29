import express from "express";
import jwtAuth from "../../middleware/jwtAuth.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { sendError, sendSuccess } from "../../utils/apiResponse.js";
import {
  categoryCreateSchema,
  categoryIdParamSchema,
  categoryListQuerySchema,
  categoryUpdateSchema,
  couponCreateSchema,
  couponIdParamSchema,
  couponListQuerySchema,
  couponUpdateSchema,
  customerIdParamSchema,
  customerListQuerySchema,
  customerStatusUpdateSchema,
  orderIdParamSchema,
  orderListQuerySchema,
  orderStatusUpdateSchema,
  productCreateSchema,
  productIdParamSchema,
  productListQuerySchema,
  productUpdateSchema,
  reviewIdParamSchema,
  reviewListQuerySchema,
  reviewStatusUpdateSchema,
  settingsUpdateSchema,
} from "../../validators/admin.js";
import {
  createCategory,
  createCoupon,
  createProduct,
  deleteCategory,
  deleteCoupon,
  deleteProduct,
  deleteReview,
  getCategories,
  getCategory,
  getCoupon,
  getCoupons,
  getCustomer,
  getCustomers,
  getDashboardSummary,
  getOrder,
  getOrders,
  getProduct,
  getProducts,
  getReviews,
  getSettings,
  updateCategory,
  updateCoupon,
  updateCustomerStatus,
  updateOrderStatus,
  updateProduct,
  updateProductStock,
  updateReviewStatus,
  updateSettings,
} from "./adminStore.js";

const router = express.Router();

const sendList = (res, items) => sendSuccess(res, items, { message: "List loaded" });

router.get("/dashboard/summary", jwtAuth, requireAdmin, (_req, res) => { sendSuccess(res, getDashboardSummary(), { message: "Dashboard summary loaded" }); });

router.get("/products", jwtAuth, requireAdmin, validateRequest({ query: productListQuerySchema }), (req, res) => { sendSuccess(res, getProducts(req.query), { message: "Products loaded" }); });
router.get("/products/:productId", jwtAuth, requireAdmin, validateRequest({ params: productIdParamSchema }), (req, res) => {
  const product = getProduct(req.params.productId);
  if (!product) return sendError(res, "Product not found", { status: 404 });
  return sendSuccess(res, product, { message: "Product loaded" });
});
router.post("/products", jwtAuth, requireAdmin, validateRequest({ body: productCreateSchema }), (req, res) => {
  const product = createProduct(req.body);
  return sendSuccess(res, product, { message: "Product created", status: 201 });
});
router.put("/products/:productId", jwtAuth, requireAdmin, validateRequest({ params: productIdParamSchema, body: productUpdateSchema }), (req, res) => {
  if (req.body && Object.hasOwn(req.body, "stock") && Object.keys(req.body).length === 1) {
    const updated = updateProductStock(req.params.productId, req.body.stock);
    if (!updated) return sendError(res, "Product not found", { status: 404 });
    return sendSuccess(res, updated, { message: "Stock updated" });
  }

  const updated = updateProduct(req.params.productId, req.body);
  if (!updated) return sendError(res, "Product not found", { status: 404 });
  return sendSuccess(res, updated, { message: "Product updated" });
});
router.delete("/products/:productId", jwtAuth, requireAdmin, validateRequest({ params: productIdParamSchema }), (req, res) => {
  const deleted = deleteProduct(req.params.productId);
  if (!deleted) return sendError(res, "Product not found", { status: 404 });
  return sendSuccess(res, { deleted }, { message: "Product deleted" });
});

router.get("/categories", jwtAuth, requireAdmin, validateRequest({ query: categoryListQuerySchema }), (req, res) => { sendSuccess(res, getCategories(req.query), { message: "Categories loaded" }); });
router.get("/categories/:categoryId", jwtAuth, requireAdmin, validateRequest({ params: categoryIdParamSchema }), (req, res) => {
  const category = getCategory(req.params.categoryId);
  if (!category) return sendError(res, "Category not found", { status: 404 });
  return sendSuccess(res, category, { message: "Category loaded" });
});
router.post("/categories", jwtAuth, requireAdmin, validateRequest({ body: categoryCreateSchema }), (req, res) => {
  const category = createCategory(req.body);
  return sendSuccess(res, category, { message: "Category created", status: 201 });
});
router.put("/categories/:categoryId", jwtAuth, requireAdmin, validateRequest({ params: categoryIdParamSchema, body: categoryUpdateSchema }), (req, res) => {
  const updated = updateCategory(req.params.categoryId, req.body);
  if (!updated) return sendError(res, "Category not found", { status: 404 });
  return sendSuccess(res, updated, { message: "Category updated" });
});
router.delete("/categories/:categoryId", jwtAuth, requireAdmin, validateRequest({ params: categoryIdParamSchema }), (req, res) => {
  const deleted = deleteCategory(req.params.categoryId);
  if (!deleted) return sendError(res, "Category not found", { status: 404 });
  return sendSuccess(res, { deleted }, { message: "Category deleted" });
});

router.get("/orders", jwtAuth, requireAdmin, validateRequest({ query: orderListQuerySchema }), (req, res) => { sendSuccess(res, getOrders(req.query), { message: "Orders loaded" }); });
router.get("/orders/:orderId", jwtAuth, requireAdmin, validateRequest({ params: orderIdParamSchema }), (req, res) => {
  const order = getOrder(req.params.orderId);
  if (!order) return sendError(res, "Order not found", { status: 404 });
  return sendSuccess(res, order, { message: "Order loaded" });
});
router.put("/orders/:orderId/status", jwtAuth, requireAdmin, validateRequest({ params: orderIdParamSchema, body: orderStatusUpdateSchema }), (req, res) => {
  const updated = updateOrderStatus(req.params.orderId, req.body?.status);
  if (!updated) return sendError(res, "Order not found", { status: 404 });
  return sendSuccess(res, updated, { message: "Order status updated" });
});

router.get("/customers", jwtAuth, requireAdmin, validateRequest({ query: customerListQuerySchema }), (req, res) => { sendSuccess(res, getCustomers(req.query), { message: "Customers loaded" }); });
router.get("/customers/:customerId", jwtAuth, requireAdmin, validateRequest({ params: customerIdParamSchema }), (req, res) => {
  const customer = getCustomer(req.params.customerId);
  if (!customer) return sendError(res, "Customer not found", { status: 404 });
  return sendSuccess(res, customer, { message: "Customer loaded" });
});
router.put("/customers/:customerId/status", jwtAuth, requireAdmin, validateRequest({ params: customerIdParamSchema, body: customerStatusUpdateSchema }), (req, res) => {
  const updated = updateCustomerStatus(req.params.customerId, req.body?.status);
  if (!updated) return sendError(res, "Customer not found", { status: 404 });
  return sendSuccess(res, updated, { message: "Customer status updated" });
});

router.get("/coupons", jwtAuth, requireAdmin, validateRequest({ query: couponListQuerySchema }), (req, res) => { sendSuccess(res, getCoupons(req.query), { message: "Coupons loaded" }); });
router.get("/coupons/:couponId", jwtAuth, requireAdmin, validateRequest({ params: couponIdParamSchema }), (req, res) => {
  const coupon = getCoupon(req.params.couponId);
  if (!coupon) return sendError(res, "Coupon not found", { status: 404 });
  return sendSuccess(res, coupon, { message: "Coupon loaded" });
});
router.post("/coupons", jwtAuth, requireAdmin, validateRequest({ body: couponCreateSchema }), (req, res) => {
  const coupon = createCoupon(req.body);
  return sendSuccess(res, coupon, { message: "Coupon created", status: 201 });
});
router.put("/coupons/:couponId", jwtAuth, requireAdmin, validateRequest({ params: couponIdParamSchema, body: couponUpdateSchema }), (req, res) => {
  const updated = updateCoupon(req.params.couponId, req.body);
  if (!updated) return sendError(res, "Coupon not found", { status: 404 });
  return sendSuccess(res, updated, { message: "Coupon updated" });
});
router.delete("/coupons/:couponId", jwtAuth, requireAdmin, validateRequest({ params: couponIdParamSchema }), (req, res) => {
  const deleted = deleteCoupon(req.params.couponId);
  if (!deleted) return sendError(res, "Coupon not found", { status: 404 });
  return sendSuccess(res, { deleted }, { message: "Coupon deleted" });
});

router.get("/reviews", jwtAuth, requireAdmin, validateRequest({ query: reviewListQuerySchema }), (req, res) => { sendSuccess(res, getReviews(req.query), { message: "Reviews loaded" }); });
router.put("/reviews/:reviewId/status", jwtAuth, requireAdmin, validateRequest({ params: reviewIdParamSchema, body: reviewStatusUpdateSchema }), (req, res) => {
  const updated = updateReviewStatus(req.params.reviewId, req.body?.status);
  if (!updated) return sendError(res, "Review not found", { status: 404 });
  return sendSuccess(res, updated, { message: "Review status updated" });
});
router.delete("/reviews/:reviewId", jwtAuth, requireAdmin, validateRequest({ params: reviewIdParamSchema }), (req, res) => {
  const deleted = deleteReview(req.params.reviewId);
  if (!deleted) return sendError(res, "Review not found", { status: 404 });
  return sendSuccess(res, { deleted }, { message: "Review deleted" });
});

router.get("/settings", jwtAuth, requireAdmin, (_req, res) => { sendSuccess(res, getSettings(), { message: "Settings loaded" }); });
router.put("/settings", jwtAuth, requireAdmin, validateRequest({ body: settingsUpdateSchema }), (req, res) => {
  const updated = updateSettings(req.body);
  return sendSuccess(res, updated, { message: "Settings updated" });
});

export default router;
