import { DoctorSchedule, User } from "@prisma/client";
import { TDoctorSchedulePayload } from "./doctorSchedule.validation";
import { existsById, prisma } from "../../utls/prismaUtils";
import AppError from "../../errors/AppError";
import getAllItems from "../../utls/getAllItems";
import { TQueryObject } from "../../types/common";

const createDoctorSchedule = async (
    user: User,
    payload: TDoctorSchedulePayload
) => {
    const doctor = await prisma.doctor.findUnique({
        where: { email: user.email },
    });
    if (!doctor) throw new AppError(404, "Doctor not found!");

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

const getMySchedules = async (user: User, query: TQueryObject) => {
    const andConditions = [];

    if (query.isBooked && typeof query.isBooked === "string") {
        const isBookedBoolean = query.isBooked === "true";
        query.isBooked = isBookedBoolean;
    }

    andConditions.push({
        doctor: { email: user.email },
    });
    const orderBy = {
        schedule: {
            startDateTime: "asc",
        },
    };

    const result = await getAllItems<DoctorSchedule>(
        prisma.doctorSchedule,
        query,
        {
            filterableFields: ["isBooked"],
            andConditions: andConditions,
            orderBy: orderBy,
        }
    );

    return result;
};

const deleteDocotrSchedule = async (user: User, scheduleIdd: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: { email: user.email },
    });
    if (!doctor) throw new AppError(404, "Doctor not found!");

    const isBookedScheduled = await prisma.doctorSchedule.findFirst({
        where: {
            doctorId: doctor.id,
            scheduleId: scheduleIdd,
            isBooked: true,
        },
    });

    if (isBookedScheduled) {
        throw new AppError(400, "This schedule is already booked");
    }

    const result = await prisma.doctorSchedule.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctor.id,
                scheduleId: scheduleIdd,
            },
        },
    });

    return result;
};

export const DoctorScheduleService = {
    createDoctorSchedule,
    getMySchedules,
    deleteDocotrSchedule,
};
