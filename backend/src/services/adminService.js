import prisma from "../database/prismaClient.js";
import { normalizePagination } from "../utils/pagination.js";
import { buildFilterQuery } from "../utils/filters.js";
import { buildSuccessResponse } from "../utils/apiResponse.js";

const normalizeStatus = (status) => (status === "inactive" ? "inactive" : "active");

const buildWhere = (query = {}) => {
  const filters = buildFilterQuery(query);
  const where = {
    deletedAt: null,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.q) {
    const search = filters.q.toLowerCase();
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { role: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const listAdmins = async (query = {}) => {
  const { page, limit, skip } = normalizePagination(query);
  const where = buildWhere(query);
  const sortBy = String(query.sortBy || "createdAt").trim();
  const order = String(query.order || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  const [admins, total] = await Promise.all([
    prisma.admin.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.admin.count({ where }),
  ]);

  return {
    success: true,
    message: "Admins loaded",
    data: admins,
    meta: {
      total,
      page,
      pageSize: limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const createAdmin = async (payload = {}, actorId = null) => {
  const normalizedEmail = String(payload.email || "").trim().toLowerCase();
  if (!normalizedEmail || !payload.password) {
    throw Object.assign(new Error("Email and password are required"), { status: 400 });
  }

  const existing = await prisma.admin.findFirst({ where: { email: normalizedEmail, deletedAt: null } });
  if (existing) {
    throw Object.assign(new Error("Admin already exists"), { status: 409 });
  }

  const hashedPassword = await import("bcrypt").then(({ default: bcrypt }) => bcrypt.hash(String(payload.password), 10));

  const admin = await prisma.admin.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
      name: payload.name || null,
      role: payload.role || "admin",
      status: normalizeStatus(payload.status),
      createdById: actorId,
      updatedById: actorId,
    },
  });

  return buildSuccessResponse(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      status: admin.status,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    },
    { message: "Admin created", status: 201 }
  );
};

export const updateAdmin = async (adminId, payload = {}, actorId = null) => {
  const admin = await prisma.admin.findFirst({ where: { id: Number(adminId), deletedAt: null } });
  if (!admin) {
    throw Object.assign(new Error("Admin not found"), { status: 404 });
  }

  const data = {};
  if (payload.name !== undefined) data.name = payload.name || null;
  if (payload.role !== undefined) data.role = payload.role;
  if (payload.status !== undefined) data.status = normalizeStatus(payload.status);

  if (payload.password) {
    data.password = await import("bcrypt").then(({ default: bcrypt }) => bcrypt.hash(String(payload.password), 10));
  }

  if (Object.keys(data).length === 0) {
    return buildSuccessResponse({ id: admin.id, updated: false }, { message: "No changes applied" });
  }

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: {
      ...data,
      updatedById: actorId,
    },
  });

  return buildSuccessResponse(
    {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      status: updated.status,
      updatedAt: updated.updatedAt,
    },
    { message: "Admin updated" }
  );
};

export const softDeleteAdmin = async (adminId, actorId = null) => {
  const admin = await prisma.admin.findFirst({ where: { id: Number(adminId), deletedAt: null } });
  if (!admin) {
    throw Object.assign(new Error("Admin not found"), { status: 404 });
  }

  const deleted = await prisma.admin.update({
    where: { id: admin.id },
    data: {
      deletedAt: new Date(),
      updatedById: actorId,
      status: "inactive",
    },
  });

  return buildSuccessResponse({ id: deleted.id, deletedAt: deleted.deletedAt }, { message: "Admin archived" });
};

export const getAdminById = async (adminId) => {
  const admin = await prisma.admin.findFirst({ where: { id: Number(adminId), deletedAt: null } });
  if (!admin) {
    throw Object.assign(new Error("Admin not found"), { status: 404 });
  }

  return buildSuccessResponse(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      status: admin.status,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    },
    { message: "Admin loaded" }
  );
};
