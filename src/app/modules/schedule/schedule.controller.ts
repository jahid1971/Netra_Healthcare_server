import catchAsync from "../../utls/catchAsync";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { ScheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req, res) => {
    const result = await ScheduleService.createSchedule(req.body);
    sendSuccessResponse(res, result, "Schedule created successfully");
});

const getAllSchedules = catchAsync(async (req, res) => {
    const result = await ScheduleService.getAllSchedules(req.query, req.user);
    sendSuccessResponse(res, result, "All schedules fetched successfully", 200);
});

export const ScheduleController = {
    createSchedule,
    getAllSchedules,
};
