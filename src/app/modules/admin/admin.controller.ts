import catchAsynch from "../../utls/catchAsynch";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { adminService } from "./admin.service";

const getAllAdmin = catchAsynch(async (req, res) => {
    const result = await adminService.getAllLAdmin(req.query);
    sendSuccessResponse(res, result, "All Admins fetched successfully", 200);
});

const getAdminById = catchAsynch(async (req, res) => {
    const result = await adminService.getAdminById(req.params.id);
    sendSuccessResponse(res, result, "Admin fetched successfully", 200);
});

const updateAdmin = catchAsynch(async (req, res) => {
    const result = await adminService.updateAdmin(req.params.id, req.body);
    sendSuccessResponse(res, result, "Admin updated successfully", 200);
})

export const adminController = {
    getAllAdmin,
    getAdminById,
    updateAdmin,
};
