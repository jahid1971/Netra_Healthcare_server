import { Router } from "express";

import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.routes";
import { adminRoutes } from "../modules/admin/admin.router";

const router = Router();

router.use("/auth", authRoutes);

router.use("/user", userRoutes);

router.use("/admin", adminRoutes);

export default router;
