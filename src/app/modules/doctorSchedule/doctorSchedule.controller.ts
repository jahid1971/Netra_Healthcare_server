import catchAsync from "../../utls/catchAsync";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";

const createDoctorSchedule = catchAsync(async (req, res) => {
    const result = await DoctorScheduleService.createDoctorSchedule(
        req.user,
        req.body
    );
    sendSuccessResponse(
        res,
        result,
        "Doctor Schedules created successfully",
        201
    );
});


export const DoctorScheduleController = {
    createDoctorSchedule,
}