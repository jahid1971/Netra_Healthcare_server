import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import checkAuth from "../../middleWares/checkAuth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middleWares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.post(
    "/",
    validateRequest(DoctorScheduleValidation.createDoctorSchedule),
    checkAuth(UserRole.DOCTOR),
    DoctorScheduleController.createDoctorSchedule
);

export const doctorScheduleRoutes = router;
