import express from "express";
import { z } from "zod";
import jwtAuth from "../middleware/jwtAuth.js";
import prisma from "../../database/prismaClient.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";

const router = express.Router();

const addressSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(50).optional(),
  recipientName: z.string().trim().min(1, "Recipient name is required").max(100),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  street: z.string().trim().min(3, "Street is required").max(200),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  postalCode: z.string().trim().min(2, "Postal code is required").max(20),
  country: z.string().trim().min(2, "Country is required").max(100).optional(),
  isDefault: z.boolean().optional(),
});

router.get("/", jwtAuth, async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = String(req.query.q || "").trim();
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    const where = {
      customerId: req.user.id,
      ...(search ? { OR: [{ recipientName: { contains: search, mode: "insensitive" } }, { street: { contains: search, mode: "insensitive" } }, { city: { contains: search, mode: "insensitive" } }] } : {}),
    };

    const [addresses, total] = await Promise.all([
      prisma.address.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: safeLimit }),
      prisma.address.count({ where }),
    ]);

    return sendSuccess(res, { addresses, total, page: safePage, pageSize: safeLimit }, { message: "Addresses loaded" });
  } catch (err) {
    return next(err);
  }
});

router.post("/", jwtAuth, validateRequest(addressSchema), async (req, res, next) => {
  try {
    if (req.body.isDefault) {
      await prisma.address.updateMany({ where: { customerId: req.user.id }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({ data: { customerId: req.user.id, ...req.body } });
    return sendSuccess(res, { address }, { message: "Address saved" }, 201);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:addressId", jwtAuth, validateRequest({ body: addressSchema, params: z.object({ addressId: z.string().trim().min(1) }) }), async (req, res, next) => {
  try {
    const addressId = Number(req.params.addressId);
    const existing = await prisma.address.findFirst({ where: { id: addressId, customerId: req.user.id } });
    if (!existing) {
      return sendError(res, "Address not found", { status: 404 });
    }

    if (req.body.isDefault) {
      await prisma.address.updateMany({ where: { customerId: req.user.id }, data: { isDefault: false } });
    }

    const address = await prisma.address.update({ where: { id: existing.id }, data: req.body });
    return sendSuccess(res, { address }, { message: "Address updated" });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:addressId", jwtAuth, async (req, res, next) => {
  try {
    const addressId = Number(req.params.addressId);
    const existing = await prisma.address.findFirst({ where: { id: addressId, customerId: req.user.id } });
    if (!existing) {
      return sendError(res, "Address not found", { status: 404 });
    }

    await prisma.address.delete({ where: { id: existing.id } });
    return sendSuccess(res, null, { message: "Address removed" });
  } catch (err) {
    return next(err);
  }
});

export default router;
