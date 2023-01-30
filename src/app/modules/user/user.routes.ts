import express from "express";
import { userController } from "./user.controller";
import { handleImageUpload } from "../../middleWares/handleImageUpload";
import checkAuth from "../../middleWares/checkAuth";
import { UserRole } from "@prisma/client";
import { userRole } from "../../constants/user";

const router = express.Router();

router.post("/create-admin", handleImageUpload, userController.createAdmin);

router.post("/create-doctor", handleImageUpload, userController.createDoctor);

router.post("/create-patient", handleImageUpload, userController.createPatient);

router.get("/", userController.getAllUsers);

router.get(
    "/me",
    checkAuth(
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ),
    userController.getMyProfile
);

router.patch(
    "/change-status/:id",
    checkAuth(UserRole.SUPER_ADMIN, userRole.ADMIN),
    userController.changeUserStatus
);
export const userRoutes = router;
