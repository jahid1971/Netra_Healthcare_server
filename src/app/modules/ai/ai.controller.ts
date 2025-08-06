import { Request, Response } from "express";
import catchAsync from "../../utls/catchAsync";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { AiService } from "./ai.service";
import { SpecialtyServices } from "../specialty/specialty.service";
import { DoctorService } from "../doctor/doctor.service";

const suggestSpecialist = catchAsync(async (req, res) => {
    const { symptoms } = req.body;
    if (!symptoms) {
        return res.status(400).json({ error: "Symptoms are required." });
    }
    // Fetch all specialties from DB
    const specialtiesResult = await SpecialtyServices.getAllSpecialties({});
    const specialties = specialtiesResult?.data?.map((s: any) => s.title) || [];
    const aiReslt = await AiService.getSpecialistSuggestion(
        symptoms,
        specialties
    );
    const availableSpecialty = aiReslt?.availableSpecialty;
    const requiredSpecialty = aiReslt?.requiredSpecialty;

    let specialtyId: string | undefined = undefined;
    if (availableSpecialty) {
        specialtyId = specialtiesResult?.data?.find(
            (s: any) => s.title === availableSpecialty
        )?.id;
    }

    const suggestedDoctores = await DoctorService.getAllDoctors({
        specialties: specialtyId,
    });

    console.log("Suggested Doctors:---------- ", suggestedDoctores);

    sendSuccessResponse(
        res,
        { suggestedDoctores, availableSpecialty, requiredSpecialty },
        "Specialist suggestion retrieved successfully."
    );
});

export const AiController = {
    suggestSpecialist,
};
