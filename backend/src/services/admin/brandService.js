import prisma from "../../database/prismaClient.js";

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

const getUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let attempt = 0;

  while (true) {
    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (!existing) {
      return slug;
    }
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }
};

const buildBrandResponse = (brand) => {
  if (!brand) return null;
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description ?? "",
    status: brand.status,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  };
};

const buildBrandQuery = (query = {}) => {
  const normalizedSearch = normalizeString(query.q);
  const where = { deletedAt: null };

  if (normalizeString(query.status)) {
    where.status = normalizeString(query.status);
  }

  if (normalizedSearch) {
    where.OR = [
      { name: { contains: normalizedSearch, mode: "insensitive" } },
      { slug: { contains: normalizedSearch, mode: "insensitive" } },
      { description: { contains: normalizedSearch, mode: "insensitive" } },
    ];
  }

  return where;
};

const mapBrandOrderBy = (sortBy, order = "asc") => {
  const direction = order === "desc" ? "desc" : "asc";
  switch (sortBy) {
    case "createdAt":
      return { createdAt: direction };
    case "name":
    default:
      return { name: direction };
  }
};

const resolveBrandWhere = (brandId) => {
  const parsedId = Number(brandId);
  if (Number.isInteger(parsedId) && String(parsedId) === String(brandId)) {
    return { id: parsedId };
  }
  return { slug: String(brandId).trim() };
};

export const getBrands = async (query = {}) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const skip = Math.max(0, (page - 1) * Math.max(1, limit || 1));
  const where = buildBrandQuery(query);
  const orderBy = mapBrandOrderBy(query.sortBy, query.order);

  const total = await prisma.brand.count({ where });
  const items = await prisma.brand.findMany({
    where,
    orderBy,
    skip: limit === 0 ? undefined : skip,
    take: limit === 0 ? undefined : Math.max(1, limit),
  });

  return {
    items: items.map(buildBrandResponse),
    total,
    page: Math.max(1, page),
    pageSize: limit === 0 ? total : Math.max(1, limit),
  };
};

export const getBrand = async (brandId) => {
  const where = resolveBrandWhere(brandId);
  const brand = await prisma.brand.findFirst({ where: { ...where, deletedAt: null } });
  return buildBrandResponse(brand);
};

export const createBrand = async (payload = {}) => {
  const name = normalizeString(payload.name);
  const slugBase = slugify(payload.slug || name) || `brand-${Date.now()}`;
  const slug = await getUniqueSlug(slugBase);

  const brand = await prisma.brand.create({
    data: {
      name,
      slug,
      description: normalizeString(payload.description) || null,
      status: normalizeString(payload.status) || "active",
    },
  });

  return buildBrandResponse(brand);
};

export const updateBrand = async (brandId, payload = {}) => {
  const where = resolveBrandWhere(brandId);
  const existing = await prisma.brand.findFirst({ where: { ...where, deletedAt: null } });
  if (!existing) return null;

  const data = {};
  if (payload.name !== undefined) {
    data.name = normalizeString(payload.name) || existing.name;
  }

  if (payload.slug !== undefined) {
    const slugBase = slugify(payload.slug || payload.name || existing.name) || `brand-${Date.now()}`;
    data.slug = slugBase === existing.slug ? existing.slug : await getUniqueSlug(slugBase);
  }

  if (payload.description !== undefined) {
    data.description = normalizeString(payload.description) || null;
  }

  if (payload.status !== undefined) {
    data.status = normalizeString(payload.status) || existing.status;
  }

  const updated = await prisma.brand.update({
    where: { id: existing.id },
    data,
  });

  return buildBrandResponse(updated);
};

export const deleteBrand = async (brandId) => {
  const where = resolveBrandWhere(brandId);
  const existing = await prisma.brand.findFirst({ where: { ...where, deletedAt: null } });
  if (!existing) return null;

  const deleted = await prisma.brand.update({
    where: { id: existing.id },
    data: { deletedAt: new Date() },
  });

  return buildBrandResponse(deleted);
};
