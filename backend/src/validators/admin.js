import { z } from "zod";

const allowedAdminRoles = ["admin", "super_admin"];
const allowedAdminStatuses = ["active", "inactive"];
const allowedAdminSortFields = ["name", "email", "role", "status", "createdAt"];
const allowedProductStatuses = ["active", "draft", "archived"];
const allowedCategoryStatuses = ["active", "inactive"];
const allowedOrderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const allowedPaymentStatuses = ["pending", "paid", "failed", "refunded"];
const allowedCustomerStatuses = ["active", "inactive", "blocked"];
const allowedCouponStatuses = ["active", "inactive", "expired"];
const allowedReviewStatuses = ["pending", "approved", "rejected"];

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page must be at least 1").optional(),
  limit: z.coerce.number().int().min(1, "Limit must be at least 1").optional(),
  q: z.string().trim().max(100, "Search must be 100 characters or fewer").optional().or(z.literal("")),
  status: z.string().trim().max(50, "Status is too long").optional().or(z.literal("")),
  sortBy: z.string().trim().max(50, "Sort field is too long").optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const adminIdParamSchema = z.object({
  adminId: z.string().trim().min(1, "Admin ID is required"),
});

export const adminUserListQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page must be at least 1").optional(),
  limit: z.coerce.number().int().min(1, "Limit must be at least 1").optional(),
  q: z.string().trim().max(100, "Search must be 100 characters or fewer").optional().or(z.literal("")),
  role: z.enum(allowedAdminRoles).optional().or(z.literal("")),
  status: z.enum(allowedAdminStatuses).optional().or(z.literal("")),
  sortBy: z.enum(allowedAdminSortFields).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const productIdParamSchema = z.object({ productId: z.string().trim().min(1, "Product ID is required") });
export const categoryIdParamSchema = z.object({ categoryId: z.string().trim().min(1, "Category ID is required") });
export const orderIdParamSchema = z.object({ orderId: z.string().trim().min(1, "Order ID is required") });
export const customerIdParamSchema = z.object({ customerId: z.string().trim().min(1, "Customer ID is required") });
export const couponIdParamSchema = z.object({ couponId: z.string().trim().min(1, "Coupon ID is required") });
export const reviewIdParamSchema = z.object({ reviewId: z.string().trim().min(1, "Review ID is required") });

export const productListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(allowedProductStatuses).optional().or(z.literal("")),
  sortBy: z.enum(["title", "price", "stock", "createdAt"]).optional(),
});

export const categoryListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(allowedCategoryStatuses).optional().or(z.literal("")),
  sortBy: z.enum(["name", "createdAt"]).optional(),
});

export const orderListQuerySchema = paginationQuerySchema.extend({
  orderStatus: z.enum(allowedOrderStatuses).optional().or(z.literal("")),
  paymentStatus: z.enum(allowedPaymentStatuses).optional().or(z.literal("")),
  paymentMethod: z.string().trim().max(30).optional().or(z.literal("")),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  sortBy: z.enum(["orderDate", "totalAmount", "customerName"]).optional(),
});

export const customerListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(allowedCustomerStatuses).optional().or(z.literal("")),
  sortBy: z.enum(["name", "email", "registeredAt", "totalSpent"]).optional(),
});

export const couponListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(allowedCouponStatuses).optional().or(z.literal("")),
  sortBy: z.enum(["code", "discount", "expiresAt", "createdAt"]).optional(),
});

export const reviewListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(allowedReviewStatuses).optional().or(z.literal("")),
  sortBy: z.enum(["rating", "createdAt", "reviewer"]).optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const adminUserCreateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long").optional().or(z.literal("")),
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(allowedAdminRoles).default("admin"),
  status: z.enum(allowedAdminStatuses).default("active"),
});

export const adminUserUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long").optional().or(z.literal("")),
  email: z.string().trim().email("Please provide a valid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional().or(z.literal("")),
  role: z.enum(allowedAdminRoles).optional(),
  status: z.enum(allowedAdminStatuses).optional(),
});

export const productCreateSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters long"),
  description: z.string().trim().max(2000, "Description is too long").optional(),
  price: z.coerce.number().nonnegative("Price must be zero or greater"),
  category: z.string().trim().min(2, "Category is required"),
  brand: z.string().trim().min(2, "Brand is required"),
  stock: z.coerce.number().int().nonnegative("Stock must be zero or greater"),
  status: z.enum(allowedProductStatuses).default("active"),
  tags: z.array(z.string().trim().min(1)).optional(),
  imageUrl: z.string().trim().url("Please provide a valid image URL").optional().or(z.literal("")),
  images: z.array(z.string().trim().url("Please provide a valid image URL")).optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters long"),
  description: z.string().trim().max(1000, "Description is too long").optional(),
  status: z.enum(allowedCategoryStatuses).default("active"),
  banner: z.string().trim().url("Please provide a valid banner URL").optional().or(z.literal("")),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const orderStatusUpdateSchema = z.object({
  status: z.enum(allowedOrderStatuses, { errorMap: () => ({ message: "Please choose a valid order status" }) }),
});

export const customerStatusUpdateSchema = z.object({
  status: z.enum(allowedCustomerStatuses, { errorMap: () => ({ message: "Please choose a valid customer status" }) }),
});

export const couponCreateSchema = z.object({
  code: z.string().trim().min(2, "Coupon code is required").toUpperCase(),
  description: z.string().trim().max(1000, "Description is too long").optional(),
  discountType: z.enum(["percent", "fixed"]).default("percent"),
  discount: z.coerce.number().nonnegative("Discount must be zero or greater"),
  status: z.enum(allowedCouponStatuses).default("active"),
  expiresAt: z.string().trim().optional().or(z.literal("")),
  usageLimit: z.coerce.number().int().nonnegative().optional(),
});

export const couponUpdateSchema = couponCreateSchema.partial();

export const reviewStatusUpdateSchema = z.object({
  status: z.enum(allowedReviewStatuses, { errorMap: () => ({ message: "Please choose a valid review status" }) }),
});

export const settingsUpdateSchema = z.object({
  storeName: z.string().trim().min(2, "Store name must be at least 2 characters long").optional(),
  storeDescription: z.string().trim().max(2000, "Description is too long").optional(),
  contactEmail: z.string().trim().email("Please provide a valid contact email").optional(),
  defaultCurrency: z.string().trim().max(10).optional(),
  taxEnabled: z.boolean().optional(),
  taxPercentage: z.coerce.number().nonnegative().optional(),
  freeShippingThreshold: z.coerce.number().nonnegative().optional(),
  flatShippingCharge: z.coerce.number().nonnegative().optional(),
  estimatedDeliveryDays: z.coerce.number().int().nonnegative().optional(),
  paymentMethods: z.array(z.string()).optional(),
  cashOnDeliveryEnabled: z.boolean().optional(),
  onlinePaymentEnabled: z.boolean().optional(),
  emailNotificationsEnabled: z.boolean().optional(),
  orderNotificationsEnabled: z.boolean().optional(),
  registrationNotificationsEnabled: z.boolean().optional(),
  sessionTimeoutMinutes: z.coerce.number().int().min(1).optional(),
  twoFactorEnabled: z.boolean().optional(),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  faviconUrl: z.string().trim().optional().or(z.literal("")),
});
