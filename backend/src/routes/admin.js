import express from "express";
import authRouter from "./admin/auth.js";
import adminsRouter from "./admin/admins.js";
import crudRouter from "./admin/crud.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/admins", adminsRouter);
router.use(crudRouter);

export default router;
