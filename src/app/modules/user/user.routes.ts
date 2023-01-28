import express from "express";
import { userController } from "./user.controller";
import { handleImageUpload } from "../../middleWares/handleImageUpload";

const router = express.Router();

router.post("/create-admin", handleImageUpload, userController.createAdmin);

router.post("/create-doctor", handleImageUpload, userController.createDoctor);

router.post("/create-patient", handleImageUpload, userController.createPatient);

export const userRoutes = router;
