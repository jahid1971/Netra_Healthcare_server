import catchAsync from "../../utls/catchAsync";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { SpecialtyServices } from "./specialty.service";

const createSpecialty = catchAsync(async (req, res) => {
    const { data, file } = req.body;
    const result = await SpecialtyServices.createSpecialty(data, file);

    sendSuccessResponse(res, result, "Specialty created successfully", 201);
});

const getAllSpecialties = catchAsync(async (req, res) => {
    const result = await SpecialtyServices.getAllSpecialties();

    sendSuccessResponse(res, result, "All Specialties", 200);
});

const deleteSpecialty = catchAsync(async (req, res) => {
    const result = await SpecialtyServices.deleteSpecialty(req.params.id);

    sendSuccessResponse(res, result, "Specialty deleted successfully");
});

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
};
