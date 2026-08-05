import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { sendError, sendSuccess } from "../../utils/apiResponse.js";
import { listNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../../services/user/notificationService.js";
import { z } from "zod";

const router = express.Router();

const markReadSchema = z.object({ notificationId: z.coerce.number().int().positive("Valid notification id is required") });
const pageQuerySchema = z.object({ page: z.coerce.number().int().positive().optional(), limit: z.coerce.number().int().positive().optional() });

router.get("/", jwtAuth, validateRequest({ query: pageQuerySchema }), async (req, res, next) => {
  try {
    const notifications = await listNotifications(req.user.id, req.query);
    return sendSuccess(res, notifications, { message: "Notifications loaded" });
  } catch (err) {
    return next(err);
  }
});

router.post("/:notificationId/read", jwtAuth, validateRequest({ params: markReadSchema }), async (req, res, next) => {
  try {
    const notification = await markNotificationAsRead(req.user.id, req.params.notificationId);
    if (!notification) {
      return sendError(res, "Notification not found", { status: 404 });
    }
    return sendSuccess(res, { notification }, { message: "Notification marked as read" });
  } catch (err) {
    return next(err);
  }
});

router.post("/read-all", jwtAuth, async (req, res, next) => {
  try {
    const result = await markAllNotificationsAsRead(req.user.id);
    return sendSuccess(res, { updated: result.count }, { message: "All notifications marked as read" });
  } catch (err) {
    return next(err);
  }
});

export default router;
