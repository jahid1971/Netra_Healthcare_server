import { Request, Response } from "express";
import catchAsync from "../../utls/catchAsync";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { AiService } from "./ai.service";

const suggestSpecialist = catchAsync(async (req, res) => {
    const { symptoms, specialties } = req.body;
    if (!symptoms) {
        return res.status(400).json({ error: "Symptoms are required." });
    }
    const suggestion = await AiService.getSpecialistSuggestion(symptoms, specialties || []);
    sendSuccessResponse(
        res,
        { suggestion },
        "Specialist suggestion generated successfully"
    );
});

export const AiController = {
    suggestSpecialist,
};
