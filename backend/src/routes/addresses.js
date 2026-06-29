import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import prisma from "../database/prismaClient.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const router = express.Router();

router.get("/", jwtAuth, async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { customerId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return sendSuccess(res, { addresses }, { message: "Addresses loaded" });
  } catch (err) {
    return next(err);
  }
});

export default router;
