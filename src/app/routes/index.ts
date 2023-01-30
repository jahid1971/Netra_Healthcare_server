import { Router } from "express";

import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.routes";
import { adminRoutes } from "../modules/admin/admin.router";
import { specialtyRoutes } from "../modules/specialty/specialty.routes";
import { doctorRoutes } from "../modules/doctor/doctor.router";

const router = Router();

router.use("/auth", authRoutes);

router.use("/user", userRoutes);

router.use("/admin", adminRoutes);

router.use("/specialty", specialtyRoutes);

router.use("/doctor", doctorRoutes);

export default router;
