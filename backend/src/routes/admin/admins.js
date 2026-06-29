import express from "express";
import jwtAuth from "../../middleware/jwtAuth.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import { createAdmin, getAdminById, listAdmins, softDeleteAdmin, updateAdmin } from "../../services/adminService.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { adminIdParamSchema, adminUserCreateSchema, adminUserListQuerySchema, adminUserUpdateSchema } from "../../validators/admin.js";
import { sendError, sendSuccess } from "../../utils/apiResponse.js";

const router = express.Router();

router.get("/", jwtAuth, requireAdmin, validateRequest({ query: adminUserListQuerySchema }), async (req, res, next) => {
  try {
    const result = await listAdmins(req.query);
    return res.status(result.meta?.page ? 200 : 200).json(result);
  } catch (error) {
    return next(error);
  }
});

router.get("/:adminId", jwtAuth, requireAdmin, validateRequest({ params: adminIdParamSchema }), async (req, res, next) => {
  try {
    const result = await getAdminById(req.params.adminId);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post("/", jwtAuth, requireAdmin, validateRequest(adminUserCreateSchema), async (req, res, next) => {
  try {
    const result = await createAdmin(req.body, req.user?.id ?? null);
    return res.status(result.status || 201).json(result);
  } catch (error) {
    return next(error);
  }
});

router.put("/:adminId", jwtAuth, requireAdmin, validateRequest({ params: adminIdParamSchema, body: adminUserUpdateSchema }), async (req, res, next) => {
  try {
    const result = await updateAdmin(req.params.adminId, req.body, req.user?.id ?? null);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:adminId", jwtAuth, requireAdmin, validateRequest({ params: adminIdParamSchema }), async (req, res, next) => {
  try {
    const result = await softDeleteAdmin(req.params.adminId, req.user?.id ?? null);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
