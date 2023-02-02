import { DoctorSchedule, User } from "@prisma/client";
import { TDoctorSchedulePayload } from "./doctorSchedule.validation";
import { findById, prisma } from "../../utls/prismaUtils";
import AppError from "../../errors/AppError";

const createDoctorSchedule = async (
    user: User,
    payload: TDoctorSchedulePayload
) => {
    const doctor = await prisma.doctor.findUnique({
        where: { email: user.email },
    })
    if(!doctor) throw new AppError(404, "Doctor not found!");

    const { scheduleIds } = payload;

    const doctorScheduleData = scheduleIds.map((scheduleId) => ({
        doctorId: doctor.id,
        scheduleId,
    }));

    console.log(doctorScheduleData, "doctorScheduleData........");

    const doctorSchedules = await prisma.doctorSchedule.createMany({
        data: doctorScheduleData,
        skipDuplicates: true,
    });

    return doctorSchedules;
};

export const DoctorScheduleService = {
    createDoctorSchedule,
};
