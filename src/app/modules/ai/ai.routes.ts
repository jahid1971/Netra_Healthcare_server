import { Router } from "express";
import { AiController } from "./ai.controller";
import validateRequest from "../../middleWares/validateRequest";
import { AiValidation } from "./ai.validation";

const router = Router();

router.post(
    "/suggest-specialist",
    validateRequest(AiValidation.suggestSpecialist),
    AiController.suggestSpecialist
);

export const aiRoutes = router;
