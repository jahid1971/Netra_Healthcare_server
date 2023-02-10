import catchAsync from "../../utls/catchAsync";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req, res) => {
    const result = await AppointmentService.createAppointment(
        req.body,
        req.user
    );

    sendSuccessResponse(
        res,
        result,
        "appointment created and payment url initialted"
    );
});

const getMyAppointments = catchAsync(async (req, res) => {
    const result = await AppointmentService.getMyAppointments(
        req.user,
        req.query
    );

    sendSuccessResponse(res, result, "my appointments fetched");
});

const getAllAppointments = catchAsync(async (req, res) => {
    const result = await AppointmentService.getAllAppointments(req.query);

    sendSuccessResponse(res, result, "all appointments fetched");
})

const changeAppointmentStatus = catchAsync(async (req, res) => {
    const result = await AppointmentService.changeAppointmentStatus(
        req.params.id,
        req.body.status,
        req.user

    );

    sendSuccessResponse(res, result, "appointment status changed");
})

export const AppointmentController = {
    createAppointment,
    getMyAppointments,
    getAllAppointments,
    changeAppointmentStatus,
};
