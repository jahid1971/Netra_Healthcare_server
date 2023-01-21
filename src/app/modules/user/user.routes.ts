import express from "express";
import { userController } from "./user.controller";
import { handleImageUpload } from "../../middleWares/handleImageUpload";

const router = express.Router();

router.post(
    "/create-admin",
    handleImageUpload,
    userController.createAdmin
);

export const userRoutes = router;
