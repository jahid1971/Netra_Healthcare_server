import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { handleImageUpload } from "../../middleWares/handleImageUpload";
import validateRequest from "../../middleWares/validateRequest";
import { SpecialtyValidation } from "./specialty.validation";
import checkAuth from "../../middleWares/checkAuth";
import { userRole } from "../../constants/user";

const router = Router();

router.post(
    "/create-specialty",
    checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR),
    handleImageUpload,
    validateRequest(SpecialtyValidation.createSpecialty),
    SpecialtyController.createSpecialty
);

router.get("/", SpecialtyController.getAllSpecialties);

router.delete("/:id", SpecialtyController.deleteSpecialty);

export const specialtyRoutes = router;
