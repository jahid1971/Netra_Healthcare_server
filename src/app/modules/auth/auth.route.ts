import { Router } from "express";
import { authControllers } from "./auth.controller";
import checkAuth from "../../middleWares/checkAuth";
import { userRole } from "../../constants/user";

const router = Router();

router.post("/login", authControllers.logIn);
router.post(
    "/change-password",
    checkAuth(userRole.SELLER, userRole.BRANCH_MANAGER, userRole.SUPER_ADMIN),
    authControllers.changePassword
);

export const authRoutes = router;
