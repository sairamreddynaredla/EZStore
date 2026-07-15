import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../../database/prismaClient.js";
import { resolveStockUpdate } from "./inventoryUpdate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");
const uploadUrlPrefix = "/uploads";

const slugify = (value) => {
  if (!value || typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const parseJsonArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    // continue to fallback
  }

  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
};

const normalizeTags = (value) => parseJsonArray(value);
const normalizeImages = (value) => parseJsonArray(value);

const ensureUploadDirExists = async () => {
  await fs.mkdir(uploadDir, { recursive: true });
};

const buildUploadUrl = (fileName) => `${uploadUrlPrefix}/${fileName}`;

const saveUploadedFile = async (file) => {
  await ensureUploadDirExists();
  const extension = path.extname(file.originalname || "") || ".png";
  const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}${extension}`;
  const destination = path.join(uploadDir, fileName);
  await fs.writeFile(destination, file.buffer);
  return buildUploadUrl(fileName);
};

const getUniqueSlug = async (baseSlug, modelName = "product") => {
  let slug = baseSlug;
  let attempt = 0;

  while (true) {
    const existing = await prisma[modelName].findUnique({ where: { slug } });
    if (!existing) {
      return slug;
    }
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }
};

const getOrCreateCategory = async (name) => {
  const normalizedName = normalizeString(name);
  if (!normalizedName) return null;

  const slug = slugify(normalizedName) || `category-${Date.now()}`;
  let category = await prisma.category.findUnique({ where: { slug } });
  if (category) return category;

  const uniqueSlug = await getUniqueSlug(slug, "category");
  return prisma.category.create({ data: { name: normalizedName, slug: uniqueSlug } });
};

const getOrCreateBrand = async (name) => {
  const normalizedName = normalizeString(name);
  if (!normalizedName) return null;

  const slug = slugify(normalizedName) || `brand-${Date.now()}`;
  let brand = await prisma.brand.findUnique({ where: { slug } });
  if (brand) return brand;

  const uniqueSlug = await getUniqueSlug(slug, "brand");
  return prisma.brand.create({ data: { name: normalizedName, slug: uniqueSlug } });
};

const buildProductResponse = (product) => {
  if (!product) return null;
  return {
    id: product.id,
    sku: product.sku ?? null,
    slug: product.slug,
    title: product.name,
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    stock: product.stock,
    status: product.status,
    category: product.category?.name ?? "",
    brand: product.brand?.name ?? "",
    imageUrl: product.imageUrl ?? "",
    images: Array.isArray(product.images) ? product.images : [],
    tags: Array.isArray(product.tags) ? product.tags : [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

const buildProductPayload = async (payload = {}, files = []) => {
  const title = normalizeString(payload.title || payload.name || "");
  const description = normalizeString(payload.description) || null;
  const price = Number(payload.price ?? 0);
  const stock = Number(payload.stock ?? 0);
  const status = normalizeString(payload.status) || "active";
  const categoryName = normalizeString(payload.category);
  const brandName = normalizeString(payload.brand);
  const existingImages = normalizeImages(payload.existingImages);
  const bodyImages = normalizeImages(payload.images);
  const uploadedImages = Array.isArray(files) && files.length > 0
    ? await Promise.all(files.map(saveUploadedFile))
    : [];

  const images = [...existingImages, ...bodyImages, ...uploadedImages].filter(Boolean);
  const imageUrl = normalizeString(payload.imageUrl) || images[0] || null;
  const tags = normalizeTags(payload.tags);

  const category = categoryName ? await getOrCreateCategory(categoryName) : null;
  const brand = brandName ? await getOrCreateBrand(brandName) : null;
  const slugBase = slugify(title) || `product-${Date.now()}`;
  const slug = await getUniqueSlug(slugBase, "product");

  return {
    name: title,
    slug,
    description,
    price,
    stock,
    status,
    imageUrl,
    images: images.length ? images : null,
    tags: tags.length ? tags : null,
    categoryId: category?.id ?? undefined,
    brandId: brand?.id ?? undefined,
  };
};

const buildProductUpdatePayload = async (product, payload = {}, files = []) => {
  const data = {};
  if (payload.title || payload.name) {
    const title = normalizeString(payload.title || payload.name || "");
    data.name = title;
    if (title && title !== product.name) {
      const baseSlug = slugify(title) || `product-${Date.now()}`;
      data.slug = await getUniqueSlug(baseSlug, "product");
    }
  }

  if (payload.description !== undefined) {
    data.description = normalizeString(payload.description) || null;
  }

  if (payload.price !== undefined) {
    data.price = Number(payload.price ?? product.price ?? 0);
  }

  if (payload.stock !== undefined) {
    data.stock = Number(payload.stock ?? product.stock ?? 0);
  }

  if (payload.status !== undefined) {
    data.status = normalizeString(payload.status) || product.status;
  }

  if (payload.category !== undefined) {
    const categoryName = normalizeString(payload.category);
    const category = categoryName ? await getOrCreateCategory(categoryName) : null;
    data.categoryId = category?.id ?? null;
  }

  if (payload.brand !== undefined) {
    const brandName = normalizeString(payload.brand);
    const brand = brandName ? await getOrCreateBrand(brandName) : null;
    data.brandId = brand?.id ?? null;
  }

  const existingImages = payload.existingImages !== undefined
    ? normalizeImages(payload.existingImages)
    : Array.isArray(product.images)
      ? product.images
      : [];
  const bodyImages = normalizeImages(payload.images);
  const uploadedImages = Array.isArray(files) && files.length > 0
    ? await Promise.all(files.map(saveUploadedFile))
    : [];
  const mergedImages = [...existingImages, ...bodyImages, ...uploadedImages].filter(Boolean);

  if (payload.imageUrl !== undefined) {
    const imageUrlValue = normalizeString(payload.imageUrl);
    data.imageUrl = imageUrlValue || mergedImages[0] || null;
  } else if (mergedImages.length) {
    data.imageUrl = product.imageUrl || mergedImages[0] || null;
  }

  if (payload.tags !== undefined) {
    const tags = normalizeTags(payload.tags);
    data.tags = tags.length ? tags : null;
  }

  if (mergedImages.length) {
    data.images = mergedImages;
  } else if (payload.images !== undefined || payload.existingImages !== undefined) {
    data.images = [];
  }

  return data;
};

export const buildInventoryHistoryResponse = (transaction) => {
  if (!transaction) return null;

  const type = normalizeString(transaction.type) || "set";
  const change = Number(transaction.change ?? 0);
  const label = type === "increase"
    ? "Stock increased"
    : type === "decrease"
      ? "Stock decreased"
      : "Stock adjusted";

  return {
    id: transaction.id,
    change,
    type,
    label,
    reason: transaction.reason ?? null,
    createdAt: transaction.createdAt,
    adminId: transaction.adminId ?? null,
    adminName: transaction.admin?.name || transaction.admin?.email || null,
  };
};

const buildProductQuery = (query = {}) => {
  const normalizedSearch = normalizeString(query.q);
  const where = {
    deletedAt: null,
  };

  if (normalizeString(query.status)) {
    where.status = normalizeString(query.status);
  }

  if (normalizedSearch) {
    where.OR = [
      { name: { contains: normalizedSearch, mode: "insensitive" } },
      { description: { contains: normalizedSearch, mode: "insensitive" } },
      { category: { name: { contains: normalizedSearch, mode: "insensitive" } } },
      { brand: { name: { contains: normalizedSearch, mode: "insensitive" } } },
    ];
  }

  return where;
};

const mapProductOrderBy = (sortBy, order = "asc") => {
  const direction = order === "desc" ? "desc" : "asc";

  switch (sortBy) {
    case "price":
      return { price: direction };
    case "stock":
      return { stock: direction };
    case "createdAt":
      return { createdAt: direction };
    case "title":
    default:
      return { name: direction };
  }
};

export const getProducts = async (query = {}) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const skip = Math.max(0, page - 1) * Math.max(1, limit || 1);
  const where = buildProductQuery(query);
  const orderBy = mapProductOrderBy(query.sortBy, query.order);

  const total = await prisma.product.count({ where });
  const items = await prisma.product.findMany({
    where,
    orderBy,
    skip: limit === 0 ? undefined : skip,
    take: limit === 0 ? undefined : Math.max(1, limit),
    include: { category: true, brand: true },
  });

  return {
    items: items.map(buildProductResponse),
    total,
    page: Math.max(1, page),
    pageSize: limit === 0 ? total : Math.max(1, limit),
  };
};

const resolveProductWhere = (productId) => {
  const parsedId = Number(productId);
  if (Number.isInteger(parsedId) && String(parsedId) === String(productId)) {
    return { id: parsedId };
  }
  return { slug: String(productId).trim() };
};

export const getProduct = async (productId) => {
  const where = resolveProductWhere(productId);
  const product = await prisma.product.findFirst({
    where: { ...where, deletedAt: null },
    include: { category: true, brand: true },
  });
  return buildProductResponse(product);
};

export const createProduct = async (payload = {}, files = []) => {
  const data = await buildProductPayload(payload, files);
  const product = await prisma.product.create({
    data,
    include: { category: true, brand: true },
  });
  return buildProductResponse(product);
};

export const updateProduct = async (productId, payload = {}, files = []) => {
  const where = resolveProductWhere(productId);
  const existing = await prisma.product.findFirst({ where: { ...where, deletedAt: null } });
  if (!existing) return null;

  const data = await buildProductUpdatePayload(existing, payload, files);
  const updated = await prisma.product.update({
    where: { id: existing.id },
    data,
    include: { category: true, brand: true },
  });
  return buildProductResponse(updated);
};

export const updateProductStock = async (productId, payload = {}, actorId = null) => {
  const where = resolveProductWhere(productId);
  const existing = await prisma.product.findFirst({ where: { ...where, deletedAt: null } });
  if (!existing) return null;

  const updatePayload = typeof payload === "number" ? { stock: payload } : payload ?? {};
  const resolved = resolveStockUpdate(existing.stock, updatePayload);
  const updated = await prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id: existing.id },
      data: { stock: resolved.stock },
      include: { category: true, brand: true },
    });

    await tx.inventoryTransaction.create({
      data: {
        productId: existing.id,
        adminId: actorId ? Number(actorId) : null,
        change: resolved.change,
        type: resolved.type,
        reason: resolved.reason,
      },
    });

    return product;
  });

  return buildProductResponse(updated);
};

export const getProductInventoryHistory = async (productId, query = {}) => {
  const where = resolveProductWhere(productId);
  const existing = await prisma.product.findFirst({ where: { ...where, deletedAt: null } });
  if (!existing) {
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 0,
    };
  }

  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const skip = Math.max(0, page - 1) * Math.max(1, limit || 1);

  const [total, items] = await Promise.all([
    prisma.inventoryTransaction.count({ where: { productId: existing.id } }),
    prisma.inventoryTransaction.findMany({
      where: { productId: existing.id },
      orderBy: { createdAt: "desc" },
      skip: limit === 0 ? undefined : skip,
      take: limit === 0 ? undefined : Math.max(1, limit),
      include: { admin: true },
    }),
  ]);

  return {
    items: items.map(buildInventoryHistoryResponse),
    total,
    page: Math.max(1, page),
    pageSize: limit === 0 ? total : Math.max(1, limit),
  };
};

export const deleteProduct = async (productId) => {
  const where = resolveProductWhere(productId);
  const existing = await prisma.product.findFirst({ where: { ...where, deletedAt: null } });
  if (!existing) return null;

  const deleted = await prisma.product.update({
    where: { id: existing.id },
    data: { deletedAt: new Date() },
    include: { category: true, brand: true },
  });
  return buildProductResponse(deleted);
};

/**
 * Get recommended products for a given product
 * Recommends products from same category, same brand, or similar tags
 * Excludes the current product and out-of-stock items
 * @param {string|number} productId - Product ID to get recommendations for
 * @param {number} limit - Number of recommendations to return (default: 5)
 */
export const getRecommendedProducts = async (productId, limit = 5) => {
  const where = resolveProductWhere(productId);
  const currentProduct = await prisma.product.findFirst({
    where: { ...where, deletedAt: null },
    include: { category: true, brand: true },
  });

  if (!currentProduct) return [];

  // Get products from same category or brand, excluding current product and out-of-stock
  const recommendations = await prisma.product.findMany({
    where: {
      deletedAt: null,
      stock: { gt: 0 }, // Only in-stock items
      NOT: { id: currentProduct.id }, // Exclude current product
      OR: [
        { categoryId: currentProduct.categoryId }, // Same category
        { brandId: currentProduct.brandId }, // Same brand
      ],
    },
    include: { category: true, brand: true },
    take: limit,
    orderBy: { createdAt: "desc" }, // Most recent first
  });

  return recommendations.map(buildProductResponse);
};
