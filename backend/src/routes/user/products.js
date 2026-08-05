import express from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { sendError, sendSuccess } from "../../utils/apiResponse.js";
import { getProducts, getProduct, getRecommendedProducts } from "../../services/shared/productService.js";
import { productListQuerySchema } from "../../validators/admin.js";

const router = express.Router();

router.get("/", validateRequest({ query: productListQuerySchema }), async (req, res, next) => {
  try {
    // By default only return active products unless explicitly requested
    if (!req.query.includeDiscontinued) {
      req.query.status = req.query.status || "active";
    }
    const products = await getProducts(req.query);
    return sendSuccess(res, products, { message: "Products loaded" });
  } catch (error) {
    return next(error);
  }
});

router.get("/:productId/recommended", async (req, res, next) => {
  try {
    const productId = String(req.params.productId).trim();
    const limit = Math.min(Number(req.query.limit ?? 5), 20); // Max 20 recommendations
    const recommendations = await getRecommendedProducts(productId, limit);
    return sendSuccess(res, recommendations, { message: "Recommendations loaded" });
  } catch (error) {
    return next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  try {
    const productId = String(req.params.productId).trim();
    const product = await getProduct(productId);

    if (!product) {
      return sendError(res, "Product not found", { status: 404 });
    }

    return sendSuccess(res, product, { message: "Product loaded" });
  } catch (error) {
    return next(error);
  }
});

export default router;
