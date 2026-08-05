import express from "express";
import multer from "multer";
import jwtAuth from "../middleware/jwtAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { sendError, sendSuccess } from "../../utils/apiResponse.js";
import { getSocket } from "../../socket.js";
import {
  categoryCreateSchema,
  categoryIdParamSchema,
  categoryListQuerySchema,
  categoryUpdateSchema,
  brandCreateSchema,
  brandIdParamSchema,
  brandListQuerySchema,
  brandUpdateSchema,
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
  refundDecisionSchema,
  refundRequestSchema,
  inventoryHistoryQuerySchema,
  inventoryStockUpdateSchema,
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
  deleteReview,
  getOrder,
  getOrders,
  getReviews,
  getSettings,
  updateOrderStatus,
  updateReviewStatus,
  updateSettings,
} from "./adminStore.js";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../../services/admin/couponAdminService.js";
import {
  addOrderNote,
  buildOrderDocuments,
  createRefundRequest,
  getOrder as getOrderService,
  getOrders as getOrdersService,
  resolveRefundRequest,
  updateOrderStatus as updateOrderStatusService,
  updateOrderTracking as updateOrderTrackingService,
} from "../../services/admin/orderService.js";
import {
  getCustomer as getCustomerService,
  getCustomers as getCustomersService,
  updateCustomerStatus as updateCustomerStatusService,
} from "../../services/admin/customerService.js";
import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  getCategories as getCategoriesService,
  getCategory as getCategoryService,
  updateCategory as updateCategoryService,
} from "../../services/admin/categoryService.js";
import {
  createBrand as createBrandService,
  deleteBrand as deleteBrandService,
  getBrand as getBrandService,
  getBrands as getBrandsService,
  updateBrand as updateBrandService,
} from "../../services/admin/brandService.js";
import {
  createProduct as createProductService,
  deleteProduct as deleteProductService,
  getProduct as getProductService,
  getProductInventoryHistory,
  getProducts as getProductsService,
  updateProduct as updateProductService,
  updateProductStock as updateProductStockService,
} from "../../services/shared/productService.js";
import { getDashboardSummary } from "../../services/admin/dashboardService.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const sendList = (res, items) => sendSuccess(res, items, { message: "List loaded" });

router.get("/dashboard/summary", jwtAuth, requireAdmin, async (_req, res, next) => {
  try {
    const summary = await getDashboardSummary();
    return sendSuccess(res, summary, { message: "Dashboard summary loaded" });
  } catch (error) {
    return next(error);
  }
});

router.get("/products", jwtAuth, requireAdmin, validateRequest({ query: productListQuerySchema }), async (req, res, next) => {
  try {
    const products = await getProductsService(req.query);
    return sendSuccess(res, products, { message: "Products loaded" });
  } catch (error) {
    return next(error);
  }
});
router.get("/products/:productId/stock-history", jwtAuth, requireAdmin, validateRequest({ params: productIdParamSchema, query: inventoryHistoryQuerySchema }), async (req, res, next) => {
  try {
    const history = await getProductInventoryHistory(req.params.productId, req.query);
    return sendSuccess(res, history, { message: "Stock history loaded" });
  } catch (error) {
    return next(error);
  }
});
router.get("/products/:productId", jwtAuth, requireAdmin, validateRequest({ params: productIdParamSchema }), async (req, res, next) => {
  try {
    const product = await getProductService(req.params.productId);
    if (!product) return sendError(res, "Product not found", { status: 404 });
    return sendSuccess(res, product, { message: "Product loaded" });
  } catch (error) {
    return next(error);
  }
});
router.post(
  "/products",
  jwtAuth,
  requireAdmin,
  upload.array("images"),
  validateRequest({ body: productCreateSchema }),
  async (req, res, next) => {
    try {
      const product = await createProductService(req.body, req.files || []);
      return sendSuccess(res, product, { message: "Product created", status: 201 });
    } catch (error) {
      return next(error);
    }
  }
);
router.put(
  "/products/:productId",
  jwtAuth,
  requireAdmin,
  upload.array("images"),
  validateRequest({ params: productIdParamSchema, body: inventoryStockUpdateSchema.or(productUpdateSchema) }),
  async (req, res, next) => {
    try {
      const body = req.body ?? {};
      const isInventoryAdjustment = ["stock", "stockDelta", "type", "reason"].some((key) => Object.hasOwn(body, key));
      const isInventoryOnlyPayload = isInventoryAdjustment && Object.keys(body).every((key) => ["stock", "stockDelta", "type", "reason"].includes(key));

      if (isInventoryOnlyPayload) {
        const updated = await updateProductStockService(req.params.productId, body, req.user?.id ?? null);
        if (!updated) return sendError(res, "Product not found", { status: 404 });
        
        // Emit price update event to all connected clients
        try {
          const socket = getSocket();
          const payload = {
            productId: updated.id,
            price: updated.price,
            originalPrice: updated.originalPrice || updated.price,
            stock: updated.stock,
            updatedAt: new Date(),
          };
          socket.emit(`product:priceUpdate:${updated.id}`, payload);
          // Also emit a generic product update event so admin clients can listen
          socket.emit("product:update", { product: payload });
        } catch (socketError) {
          console.error("Socket emit error:", socketError);
        }
        
        return sendSuccess(res, updated, { message: "Stock updated" });
      }

      const updated = await updateProductService(req.params.productId, req.body, req.files || []);
      if (!updated) return sendError(res, "Product not found", { status: 404 });
      
      // Emit price update event if price changed
      if (req.body.price !== undefined) {
        try {
          const socket = getSocket();
          const payload = {
            productId: updated.id,
            price: updated.price,
            originalPrice: updated.originalPrice || updated.price,
            stock: updated.stock,
            updatedAt: new Date(),
          };
          socket.emit(`product:priceUpdate:${updated.id}`, payload);
          socket.emit("product:update", { product: payload });
        } catch (socketError) {
          console.error("Socket emit error:", socketError);
        }
      }
      
      return sendSuccess(res, updated, { message: "Product updated" });
    } catch (error) {
      return next(error);
    }
  }
);
router.delete("/products/:productId", jwtAuth, requireAdmin, validateRequest({ params: productIdParamSchema }), async (req, res, next) => {
  try {
    const deleted = await deleteProductService(req.params.productId);
    if (!deleted) return sendError(res, "Product not found", { status: 404 });
    return sendSuccess(res, { deleted }, { message: "Product deleted" });
  } catch (error) {
    return next(error);
  }
});

router.get("/categories", jwtAuth, requireAdmin, validateRequest({ query: categoryListQuerySchema }), async (req, res, next) => {
  try {
    const categories = await getCategoriesService(req.query);
    return sendSuccess(res, categories, { message: "Categories loaded" });
  } catch (error) {
    return next(error);
  }
});
router.get("/categories/:categoryId", jwtAuth, requireAdmin, validateRequest({ params: categoryIdParamSchema }), async (req, res, next) => {
  try {
    const category = await getCategoryService(req.params.categoryId);
    if (!category) return sendError(res, "Category not found", { status: 404 });
    return sendSuccess(res, category, { message: "Category loaded" });
  } catch (error) {
    return next(error);
  }
});
router.post("/categories", jwtAuth, requireAdmin, validateRequest({ body: categoryCreateSchema }), async (req, res, next) => {
  try {
    const category = await createCategoryService(req.body);
    return sendSuccess(res, category, { message: "Category created", status: 201 });
  } catch (error) {
    return next(error);
  }
});
router.put("/categories/:categoryId", jwtAuth, requireAdmin, validateRequest({ params: categoryIdParamSchema, body: categoryUpdateSchema }), async (req, res, next) => {
  try {
    const updated = await updateCategoryService(req.params.categoryId, req.body);
    if (!updated) return sendError(res, "Category not found", { status: 404 });
    return sendSuccess(res, updated, { message: "Category updated" });
  } catch (error) {
    return next(error);
  }
});
router.delete("/categories/:categoryId", jwtAuth, requireAdmin, validateRequest({ params: categoryIdParamSchema }), async (req, res, next) => {
  try {
    const deleted = await deleteCategoryService(req.params.categoryId);
    if (!deleted) return sendError(res, "Category not found", { status: 404 });
    return sendSuccess(res, { deleted }, { message: "Category deleted" });
  } catch (error) {
    return next(error);
  }
});

router.get("/brands", jwtAuth, requireAdmin, validateRequest({ query: brandListQuerySchema }), async (req, res, next) => {
  try {
    const brands = await getBrandsService(req.query);
    return sendSuccess(res, brands, { message: "Brands loaded" });
  } catch (error) {
    return next(error);
  }
});
router.get("/brands/:brandId", jwtAuth, requireAdmin, validateRequest({ params: brandIdParamSchema }), async (req, res, next) => {
  try {
    const brand = await getBrandService(req.params.brandId);
    if (!brand) return sendError(res, "Brand not found", { status: 404 });
    return sendSuccess(res, brand, { message: "Brand loaded" });
  } catch (error) {
    return next(error);
  }
});
router.post("/brands", jwtAuth, requireAdmin, validateRequest({ body: brandCreateSchema }), async (req, res, next) => {
  try {
    const brand = await createBrandService(req.body);
    return sendSuccess(res, brand, { message: "Brand created", status: 201 });
  } catch (error) {
    return next(error);
  }
});
router.put("/brands/:brandId", jwtAuth, requireAdmin, validateRequest({ params: brandIdParamSchema, body: brandUpdateSchema }), async (req, res, next) => {
  try {
    const updated = await updateBrandService(req.params.brandId, req.body);
    if (!updated) return sendError(res, "Brand not found", { status: 404 });
    return sendSuccess(res, updated, { message: "Brand updated" });
  } catch (error) {
    return next(error);
  }
});
router.delete("/brands/:brandId", jwtAuth, requireAdmin, validateRequest({ params: brandIdParamSchema }), async (req, res, next) => {
  try {
    const deleted = await deleteBrandService(req.params.brandId);
    if (!deleted) return sendError(res, "Brand not found", { status: 404 });
    return sendSuccess(res, { deleted }, { message: "Brand deleted" });
  } catch (error) {
    return next(error);
  }
});

router.get("/orders", jwtAuth, requireAdmin, validateRequest({ query: orderListQuerySchema }), async (req, res, next) => {
  try {
    const orders = await getOrdersService(req.query);
    return sendSuccess(res, orders, { message: "Orders loaded" });
  } catch (error) {
    return next(error);
  }
});
router.get("/orders/:orderId", jwtAuth, requireAdmin, validateRequest({ params: orderIdParamSchema }), async (req, res, next) => {
  try {
    const order = await getOrderService(req.params.orderId);
    if (!order) return sendError(res, "Order not found", { status: 404 });
    return sendSuccess(res, order, { message: "Order loaded" });
  } catch (error) {
    return next(error);
  }
});
router.put("/orders/:orderId/status", jwtAuth, requireAdmin, validateRequest({ params: orderIdParamSchema, body: orderStatusUpdateSchema }), async (req, res, next) => {
  try {
    const updated = await updateOrderStatusService(req.params.orderId, req.body?.status, { id: req.user?.id, type: req.user?.role || "admin", note: req.body?.note || null });
    if (!updated) return sendError(res, "Order not found", { status: 404 });

    try {
      const socket = getSocket();
      socket.to("admins").emit("dashboardSummaryUpdated", {
        event: "orderStatusUpdated",
        order: {
          id: updated.id,
          orderStatus: updated.orderStatus,
        },
      });
    } catch {
      // Keep the route functional even when the socket server is unavailable.
    }

    return sendSuccess(res, updated, { message: "Order status updated" });
  } catch (error) {
    return next(error);
  }
});
router.put("/orders/:orderId/tracking", jwtAuth, requireAdmin, validateRequest({ params: orderIdParamSchema }), async (req, res, next) => {
  try {
    const updated = await updateOrderTrackingService(req.params.orderId, req.body || {});
    if (!updated) return sendError(res, "Order not found", { status: 404 });
    return sendSuccess(res, updated, { message: "Tracking updated" });
  } catch (error) {
    return next(error);
  }
});
router.post("/orders/:orderId/refunds", jwtAuth, requireAdmin, validateRequest({ params: orderIdParamSchema, body: refundRequestSchema }), async (req, res, next) => {
  try {
    const refund = await createRefundRequest(req.params.orderId, {
      ...req.body,
      actor: { id: req.user?.id, type: req.user?.role || "admin" },
    });
    if (!refund) return sendError(res, "Order not found", { status: 404 });
    return sendSuccess(res, refund, { message: "Refund request submitted" });
  } catch (error) {
    return next(error);
  }
});
router.post("/orders/:orderId/refunds/resolve", jwtAuth, requireAdmin, validateRequest({ params: orderIdParamSchema, body: refundDecisionSchema }), async (req, res, next) => {
  try {
    const refund = await resolveRefundRequest(req.params.orderId, req.body?.action, {
      ...req.body,
      actor: { id: req.user?.id, type: req.user?.role || "admin" },
    });
    if (!refund) return sendError(res, "Order not found", { status: 404 });
    return sendSuccess(res, refund, { message: "Refund request resolved" });
  } catch (error) {
    return next(error);
  }
});
router.post("/orders/:orderId/notes", jwtAuth, requireAdmin, validateRequest({ params: orderIdParamSchema }), async (req, res, next) => {
  try {
    const note = await addOrderNote(req.params.orderId, req.body || {});
    if (!note) return sendError(res, "Order not found", { status: 404 });
    return sendSuccess(res, note, { message: "Order note added" });
  } catch (error) {
    return next(error);
  }
});
router.get("/orders/:orderId/documents", jwtAuth, requireAdmin, validateRequest({ params: orderIdParamSchema }), async (req, res, next) => {
  try {
    const order = await getOrderService(req.params.orderId);
    if (!order) return sendError(res, "Order not found", { status: 404 });
    return sendSuccess(res, buildOrderDocuments(order), { message: "Order documents loaded" });
  } catch (error) {
    return next(error);
  }
});

router.get("/customers", jwtAuth, requireAdmin, validateRequest({ query: customerListQuerySchema }), async (req, res, next) => {
  try {
    const customers = await getCustomersService(req.query);
    return sendSuccess(res, customers, { message: "Customers loaded" });
  } catch (error) {
    return next(error);
  }
});
router.get("/customers/:customerId", jwtAuth, requireAdmin, validateRequest({ params: customerIdParamSchema }), async (req, res, next) => {
  try {
    const customer = await getCustomerService(req.params.customerId);
    if (!customer) return sendError(res, "Customer not found", { status: 404 });
    return sendSuccess(res, customer, { message: "Customer loaded" });
  } catch (error) {
    return next(error);
  }
});
router.put("/customers/:customerId/status", jwtAuth, requireAdmin, validateRequest({ params: customerIdParamSchema, body: customerStatusUpdateSchema }), async (req, res, next) => {
  try {
    const updated = await updateCustomerStatusService(req.params.customerId, req.body?.status);
    if (!updated) return sendError(res, "Customer not found", { status: 404 });
    return sendSuccess(res, updated, { message: "Customer status updated" });
  } catch (error) {
    return next(error);
  }
});

router.get("/coupons", jwtAuth, requireAdmin, validateRequest({ query: couponListQuerySchema }), async (req, res, next) => {
  try { return sendSuccess(res, await getCoupons(req.query), { message: "Coupons loaded" }); } catch (error) { return next(error); }
});
router.get("/coupons/:couponId", jwtAuth, requireAdmin, validateRequest({ params: couponIdParamSchema }), async (req, res, next) => {
  try {
    const coupon = await getCoupon(req.params.couponId);
    if (!coupon) return sendError(res, "Coupon not found", { status: 404 });
    return sendSuccess(res, coupon, { message: "Coupon loaded" });
  } catch (error) { return next(error); }
});
router.post("/coupons", jwtAuth, requireAdmin, validateRequest({ body: couponCreateSchema }), async (req, res, next) => {
  try { return sendSuccess(res, await createCoupon(req.body), { message: "Coupon created", status: 201 }); } catch (error) { return next(error); }
});
router.put("/coupons/:couponId", jwtAuth, requireAdmin, validateRequest({ params: couponIdParamSchema, body: couponUpdateSchema }), async (req, res, next) => {
  try {
    const updated = await updateCoupon(req.params.couponId, req.body);
    if (!updated) return sendError(res, "Coupon not found", { status: 404 });
    return sendSuccess(res, updated, { message: "Coupon updated" });
  } catch (error) { return next(error); }
});
router.delete("/coupons/:couponId", jwtAuth, requireAdmin, validateRequest({ params: couponIdParamSchema }), async (req, res, next) => {
  try {
    const deleted = await deleteCoupon(req.params.couponId);
    if (!deleted) return sendError(res, "Coupon not found", { status: 404 });
    return sendSuccess(res, { deleted: true }, { message: "Coupon deleted" });
  } catch (error) { return next(error); }
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
