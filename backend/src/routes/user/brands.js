import express from "express";
import prisma from "../../database/prismaClient.js";
import { sendSuccess } from "../../utils/apiResponse.js";

const router = express.Router();

// Public brand directory used by the storefront. Admin-created active brands
// must be read from the same database rather than a bundled static list.
router.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.brand.findMany({
      where: { status: "active", deletedAt: null },
      select: { id: true, name: true, slug: true, description: true },
      orderBy: { name: "asc" },
    });
    return sendSuccess(res, { items }, { message: "Brands loaded" });
  } catch (error) {
    return next(error);
  }
});

export default router;
