import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import validateRequest from "../../middleWares/validateRequest";
import { DoctorValidation } from "./doctor.validation";

const router = Router();

router.patch(
    "/:doctorId",
    validateRequest(DoctorValidation.updateDoctor),
    DoctorController.updateDoctor
);

router.get("/", DoctorController.getAllDoctors);

router.delete("/:doctorId", DoctorController.deleteDoctor);

router.delete("/soft-delete/:doctorId", DoctorController.softDeleteDoctor);


export const doctorRoutes = router;