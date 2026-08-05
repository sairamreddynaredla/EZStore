import prisma from "../../database/prismaClient.js";
import logger from "../../utils/logger.js";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");
const normalizeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};
const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Determine whether a candidate image URL is safe to persist. Block development-only
// bundler paths and unsafe protocols that should never be stored in the DB/localStorage.
const isPersistableImage = (val) => {
  if (!val || typeof val !== "string") return false;
  const s = val.trim();
  if (!s) return false;
  if (s.startsWith("/src/")) return false;
  if (/^(file|blob|data):/.test(s)) return false;
  return true;
};

const sanitizeImageForPersistence = (val) => {
  const s = normalizeString(val);
  return isPersistableImage(s) ? s : null;
};

export const upsertCartItem = async (customerId, payload = {}) => {
  const normalizedCustomerId = Number(customerId);
  const rawProductId = payload.productId === undefined || payload.productId === null || payload.productId === "" ? null : Number(payload.productId);
  let productId = Number.isInteger(rawProductId) && rawProductId > 0 ? rawProductId : null;
  const quantity = Math.max(1, Number(payload.quantity ?? 1) || 1);
  const unitPrice = normalizeNumber(payload.unitPrice ?? payload.price ?? 0);

  const productSlug = payload.productSlug && String(payload.productSlug).trim() ? String(payload.productSlug).trim() : null;
  const productNameSlug = !productSlug && payload.productName ? slugify(payload.productName) : null;

  if (!Number.isInteger(normalizedCustomerId) || (productId === null && !productSlug && !productNameSlug)) {
    throw Object.assign(new Error("Customer and product identifiers are required"), { status: 400 });
  }

  let product = null;
  if (productSlug) {
    product = await prisma.product.findUnique({ where: { slug: productSlug }, select: { id: true } });
  } else if (Number.isInteger(productId) && productId > 0) {
    product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  } else if (productNameSlug) {
    product = await prisma.product.findUnique({ where: { slug: productNameSlug }, select: { id: true } });
  }

  if (!product) {
    throw Object.assign(new Error("This product is no longer available"), { status: 404 });
  }

  productId = product.id;

  const existing = await prisma.cartItem.findFirst({
    where: {
      customerId: normalizedCustomerId,
      productId,
      variantKey: payload.variantKey || null,
    },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + quantity,
        unitPrice,
        selectedVariant: payload.selectedVariant ?? existing.selectedVariant ?? null,
      },
    });
    return { ...updated, action: "updated" };
  }

  const created = await prisma.cartItem.create({
    data: {
      customerId: normalizedCustomerId,
      productId,
      productName: normalizeString(payload.productName) || "Product",
      productImage: sanitizeImageForPersistence(payload.productImage || payload.image || payload.imageUrl),
      unitPrice,
      quantity,
      variantKey: payload.variantKey ? String(payload.variantKey) : null,
      selectedVariant: payload.selectedVariant ?? null,
    },
  });

  return { ...created, action: "created" };
};

export const listCartItems = async (customerId) => {
  const normalizedCustomerId = Number(customerId);
  if (!Number.isInteger(normalizedCustomerId)) {
    throw Object.assign(new Error("Customer identifier is required"), { status: 400 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { customerId: normalizedCustomerId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          status: true,
          deletedAt: true,
          stock: true,
          trackInventory: true,
          isActive: true,
          slug: true,
        },
      },
    },
  });

  const validItems = [];
  const invalidItemIds = [];
  const updatePromises = [];

  for (const item of cartItems) {
    const product = item.product;
    const isActive = product && product.status === "active" && product.deletedAt === null && (product.isActive !== false);
    const trackInventory = product?.trackInventory === undefined ? true : Boolean(product.trackInventory);
    const availableStock = Number(product?.stock ?? 0);
    const requestedQuantity = Number(item.quantity ?? 1);

    if (!product || !isActive || (trackInventory && availableStock <= 0)) {
      invalidItemIds.push(item.id);
      continue;
    }

    const updateData = {};
    const normalizedPrice = Number(product.price ?? 0);
    const normalizedName = String(product.name || item.productName || "Product");
    const existingImage = item.productImage || null;
    const normalizedImage = product.imageUrl || (isPersistableImage(existingImage) ? existingImage : null);
    const normalizedQuantity = trackInventory && requestedQuantity > availableStock ? availableStock : requestedQuantity;

    if (item.unitPrice !== normalizedPrice) {
      updateData.unitPrice = normalizedPrice;
    }
    if (item.productName !== normalizedName) {
      updateData.productName = normalizedName;
    }
    if (existingImage !== normalizedImage) {
      updateData.productImage = normalizedImage;
    }
    if (item.quantity !== normalizedQuantity) {
      updateData.quantity = normalizedQuantity;
    }

    if (Object.keys(updateData).length > 0) {
      updatePromises.push(
        prisma.cartItem.update({
          where: { id: item.id },
          data: updateData,
        })
      );
    }

    validItems.push({
      ...item,
      ...updateData,
      product,
    });
  }

  if (invalidItemIds.length > 0) {
    prisma.cartItem
      .deleteMany({ where: { id: { in: invalidItemIds } } })
      .catch((err) => {
        console.warn("Failed to clean orphaned cart items:", err.message);
      });
  }

  if (updatePromises.length > 0) {
    await Promise.all(updatePromises);
  }

  return validItems;
};

export const updateCartItemQuantity = async (customerId, itemId, quantity) => {
  const normalizedCustomerId = Number(customerId);
  const parsedItemId = Number(itemId);
  const parsedQuantity = Number(quantity);

  if (!Number.isInteger(normalizedCustomerId) || !Number.isInteger(parsedItemId)) {
    throw Object.assign(new Error("Customer and cart item identifiers are required"), { status: 400 });
  }

  const existing = await prisma.cartItem.findFirst({ where: { id: parsedItemId, customerId: normalizedCustomerId } });
  if (!existing) {
    throw Object.assign(new Error("Cart item not found"), { status: 404 });
  }

  const safeQuantity = Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;
  return prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: safeQuantity } });
};

export const removeCartItem = async (customerId, itemId) => {
  const normalizedCustomerId = Number(customerId);
  const parsedItemId = Number(itemId);

  if (!Number.isInteger(normalizedCustomerId) || !Number.isInteger(parsedItemId)) {
    throw Object.assign(new Error("Customer and cart item identifiers are required"), { status: 400 });
  }

  const existing = await prisma.cartItem.findFirst({ where: { id: parsedItemId, customerId: normalizedCustomerId } });
  if (!existing) {
    throw Object.assign(new Error("Cart item not found"), { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id: existing.id } });
  return { deleted: true, itemId: existing.id };
};

export const clearCart = async (customerId) => {
  const normalizedCustomerId = Number(customerId);
  if (!Number.isInteger(normalizedCustomerId)) {
    throw Object.assign(new Error("Customer identifier is required"), { status: 400 });
  }

  await prisma.cartItem.deleteMany({ where: { customerId: normalizedCustomerId } });
  return { deleted: true };
};

export const toggleWishlistItem = async (customerId, payload = {}, { ensurePresent = false } = {}) => {
  logger.info("toggleWishlist.enter", { customerId, payload });
  const normalizedCustomerId = Number(customerId);
  const rawProductId = payload.productId === undefined || payload.productId === null || payload.productId === "" ? null : Number(payload.productId);
  const rawWishlistItemId = payload.wishlistItemId === undefined || payload.wishlistItemId === null || payload.wishlistItemId === "" ? null : Number(payload.wishlistItemId);
  let productId = rawProductId;
  let wishlistItemId = rawWishlistItemId;

  if (!Number.isInteger(normalizedCustomerId)) {
    throw Object.assign(new Error("Customer identifier is required"), { status: 400 });
  }

  if (productId !== null && (!Number.isInteger(productId) || productId <= 0)) {
    productId = null;
  }

  if (wishlistItemId !== null && (!Number.isInteger(wishlistItemId) || wishlistItemId <= 0)) {
    wishlistItemId = null;
  }

  const productSlug = payload.productSlug && String(payload.productSlug).trim() ? String(payload.productSlug).trim() : null;
  const productNameSlug = !productSlug && payload.productName ? slugify(payload.productName) : null;

  if (productId === null && !wishlistItemId && !productSlug && !productNameSlug) {
    throw Object.assign(new Error("Either productId, wishlistItemId or productSlug is required"), { status: 400 });
  }

  if (!productId && wishlistItemId) {
    logger.info("toggleWishlist.resolve_from_wishlistItem", { wishlistItemId });
    const wishlistItem = await prisma.wishlistItem.findUnique({ where: { id: wishlistItemId } });
    if (!wishlistItem || wishlistItem.customerId !== normalizedCustomerId) {
      logger.info("toggleWishlist.wishlistItem_not_found", { wishlistItem, wishlistItemId, customerId: normalizedCustomerId });
      throw Object.assign(new Error("Wishlist item not found"), { status: 404 });
    }
    productId = wishlistItem.productId;
    logger.info("toggleWishlist.resolved_productId_from_wishlistItem", { productId });
  }

  // The storefront catalogue can use IDs that differ from the database IDs.
  // Resolve the supplied slug first so the wishlist always references a real
  // Product record and cannot fail with a foreign-key error.
  let product = null;
  if (productSlug) {
    product = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: { id: true },
    });
  } else if (Number.isInteger(productId) && productId > 0) {
    product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
  } else if (productNameSlug) {
    product = await prisma.product.findUnique({
      where: { slug: productNameSlug },
      select: { id: true },
    });
  }

  if (!product) {
    logger.info("toggleWishlist.product_not_found", { productSlug, productId, productNameSlug });
    throw Object.assign(new Error("This product is no longer available"), { status: 404 });
  }

  productId = product.id;

  const existingItems = await prisma.wishlistItem.findMany({ where: { customerId: normalizedCustomerId, productId } });
  if (existingItems.length > 0) {
    if (ensurePresent) {
      logger.info("toggleWishlist.already_present", { existingItemsCount: existingItems.length });
      return { action: "existing", item: existingItems[0] };
    }
    logger.info("toggleWishlist.removing_items", { itemIds: existingItems.map((item) => item.id) });
    await prisma.wishlistItem.deleteMany({ where: { customerId: normalizedCustomerId, productId } });
    return { action: "removed", itemIds: existingItems.map((item) => item.id) };
  }

  const created = await prisma.wishlistItem.create({
    data: {
      customerId: normalizedCustomerId,
      productId,
      productName: normalizeString(payload.productName) || "Product",
      productImage: sanitizeImageForPersistence(payload.productImage) || null,
      productPrice: normalizeNumber(payload.unitPrice ?? payload.price ?? 0),
    },
  });
  logger.info("toggleWishlist.created", { createdId: created.id });

  return { action: "added", item: created };
};

export const removeWishlistItem = async (customerId, wishlistItemId) => {
  const normalizedCustomerId = Number(customerId);
  const normalizedWishlistItemId = Number(wishlistItemId);

  if (!Number.isInteger(normalizedCustomerId)) {
    throw Object.assign(new Error("Customer identifier is required"), { status: 400 });
  }

  if (!Number.isInteger(normalizedWishlistItemId) || normalizedWishlistItemId <= 0) {
    throw Object.assign(new Error("Wishlist item ID is required"), { status: 400 });
  }

  const wishlistItem = await prisma.wishlistItem.findUnique({ where: { id: normalizedWishlistItemId } });
  if (!wishlistItem || wishlistItem.customerId !== normalizedCustomerId) {
    throw Object.assign(new Error("Wishlist item not found"), { status: 404 });
  }

  await prisma.wishlistItem.delete({ where: { id: normalizedWishlistItemId } });
  return { deleted: true, itemId: normalizedWishlistItemId };
};

export const listWishlistItems = async (customerId) => {
  const normalizedCustomerId = Number(customerId);
  if (!Number.isInteger(normalizedCustomerId)) {
    throw Object.assign(new Error("Customer identifier is required"), { status: 400 });
  }

  return prisma.wishlistItem.findMany({
    where: { customerId: normalizedCustomerId },
    orderBy: { createdAt: "desc" },
    include: { product: { select: { id: true, name: true, price: true, stock: true, imageUrl: true } } },
  });
};

export const upsertSavedItem = async (customerId, payload = {}) => {
  const normalizedCustomerId = Number(customerId);
  const productId = Number(payload.productId);

  if (!Number.isInteger(normalizedCustomerId) || !Number.isInteger(productId)) {
    throw Object.assign(new Error("Customer and product identifiers are required"), { status: 400 });
  }

  const existing = await prisma.savedItem.findFirst({ where: { customerId: normalizedCustomerId, productId } });
  if (existing) {
    return existing;
  }

  return prisma.savedItem.create({
    data: {
      customerId: normalizedCustomerId,
      productId,
      productName: normalizeString(payload.productName) || "Product",
      productImage: sanitizeImageForPersistence(payload.productImage) || null,
      productPrice: normalizeNumber(payload.unitPrice ?? payload.price ?? 0),
    },
  });
};

export const listSavedItems = async (customerId) => {
  const normalizedCustomerId = Number(customerId);
  if (!Number.isInteger(normalizedCustomerId)) {
    throw Object.assign(new Error("Customer identifier is required"), { status: 400 });
  }

  return prisma.savedItem.findMany({
    where: { customerId: normalizedCustomerId },
    orderBy: { createdAt: "desc" },
    include: { product: { select: { id: true, name: true, price: true, stock: true, imageUrl: true } } },
  });
};

export const upsertRecentlyViewedItem = async (customerId, payload = {}) => {
  const normalizedCustomerId = Number(customerId);
  const rawProductId = payload.productId === undefined || payload.productId === null || payload.productId === "" ? null : Number(payload.productId);
  let productId = rawProductId;

  if (!Number.isInteger(normalizedCustomerId)) {
    throw Object.assign(new Error("Customer identifier is required"), { status: 400 });
  }

  if (productId !== null && (!Number.isInteger(productId) || productId <= 0)) {
    productId = null;
  }

  const productSlug = payload.productSlug && String(payload.productSlug).trim() ? String(payload.productSlug).trim() : null;
  const productNameSlug = !productSlug && payload.productName ? slugify(payload.productName) : null;

  if (productId === null && !productSlug && !productNameSlug) {
    throw Object.assign(new Error("Either productId or productSlug is required"), { status: 400 });
  }

  // Resolve the supplied slug to a real database product ID if needed
  let product = null;
  if (productSlug) {
    product = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: { id: true },
    });
  } else if (Number.isInteger(productId) && productId > 0) {
    product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
  } else if (productNameSlug) {
    product = await prisma.product.findUnique({
      where: { slug: productNameSlug },
      select: { id: true },
    });
  }

  if (!product) {
    throw Object.assign(new Error("This product is no longer available"), { status: 404 });
  }

  productId = product.id;

  const existingItems = await prisma.recentlyViewedItem.findMany({
    where: { customerId: normalizedCustomerId, productId },
    orderBy: { createdAt: "desc" },
  });

  if (existingItems.length > 0) {
    const [latest, ...duplicates] = existingItems;
    const productPrice = normalizeNumber(payload.unitPrice ?? payload.price ?? latest.productPrice ?? 0);
    const updatedItem = await prisma.recentlyViewedItem.update({
      where: { id: latest.id },
      data: {
        createdAt: new Date(),
        productName: normalizeString(payload.productName) || latest.productName,
        productImage:
          sanitizeImageForPersistence(payload.productImage) ?? (isPersistableImage(latest.productImage) ? latest.productImage : null),
        productPrice,
      },
    });

    if (duplicates.length > 0) {
      await prisma.recentlyViewedItem.deleteMany({ where: { customerId: normalizedCustomerId, productId, id: { in: duplicates.map((item) => item.id) } } });
    }

    return updatedItem;
  }

  return prisma.recentlyViewedItem.create({
    data: {
      customerId: normalizedCustomerId,
      productId,
      productName: normalizeString(payload.productName) || "Product",
      productImage: sanitizeImageForPersistence(payload.productImage) || null,
      productPrice: normalizeNumber(payload.unitPrice ?? payload.price ?? 0),
    },
  });
};

export const listRecentlyViewedItems = async (customerId) => {
  const normalizedCustomerId = Number(customerId);
  if (!Number.isInteger(normalizedCustomerId)) {
    throw Object.assign(new Error("Customer identifier is required"), { status: 400 });
  }

  return prisma.recentlyViewedItem.findMany({
    where: { customerId: normalizedCustomerId },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { product: { select: { id: true, name: true, price: true, stock: true, imageUrl: true } } },
  });
};

export const createReview = async (customerId, payload = {}) => {
  const normalizedCustomerId = Number(customerId);
  const productId = Number(payload.productId);
  const rating = Number(payload.rating);

  if (!Number.isInteger(normalizedCustomerId) || !Number.isInteger(productId)) {
    throw Object.assign(new Error("Customer and product identifiers are required"), { status: 400 });
  }

  const existingReview = await prisma.review.findFirst({ where: { customerId: normalizedCustomerId, productId } });
  if (existingReview) {
    throw Object.assign(new Error("You have already reviewed this product"), { status: 409 });
  }

  const review = await prisma.review.create({
    data: {
      customerId: normalizedCustomerId,
      productId,
      rating: Number.isFinite(rating) && rating > 0 ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
      title: normalizeString(payload.title) || null,
      comment: normalizeString(payload.comment) || null,
      status: "approved",
    },
  });

  await prisma.notification.create({
    data: {
      customerId: normalizedCustomerId,
      title: "New review received",
      message: "Your review has been published.",
      type: "product_alert",
      channel: "in_app",
      metadata: { productId },
    },
  });

  return { review, notification: { title: "New review received" } };
};

export const listReviews = async (customerId, query = {}) => {
  const normalizedCustomerId = Number(customerId);
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  if (!Number.isInteger(normalizedCustomerId)) {
    throw Object.assign(new Error("Customer identifier is required"), { status: 400 });
  }

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where: { customerId: normalizedCustomerId },
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
      include: { product: { select: { id: true, name: true, imageUrl: true } } },
    }),
    prisma.review.count({ where: { customerId: normalizedCustomerId } }),
  ]);

  return { items, total, page: safePage, pageSize: safeLimit };
};
