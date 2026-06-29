import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import prisma from "../database/prismaClient.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const router = express.Router();

router.get("/", jwtAuth, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      orderBy: { placedAt: "desc" },
    });
    return sendSuccess(res, { orders }, { message: "Orders loaded" });
  } catch (err) {
    return next(err);
  }
});

export default router;
