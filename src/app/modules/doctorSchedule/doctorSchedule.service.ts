import { DoctorSchedule, Schedule, User } from "@prisma/client";
import { TDoctorSchedulePayload } from "./doctorSchedule.validation";
import { prisma } from "../../services/prisma.service";
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

    const doctorSchedules = await prisma.doctorSchedule.createMany({
        data: doctorScheduleData,
        skipDuplicates: true,
    });

    return doctorSchedules;
};

// get my schedules.................................................................................
const getMySchedules = async (user: User, query: TQueryObject) => {
    const andConditions = [];

    if (query.isBooked && typeof query.isBooked === "string") {
        const isBookedBoolean = query.isBooked === "true";
        query.isBooked = isBookedBoolean;
    }

    andConditions.push({ doctor: { email: user.email } });

    if (query.startDate) {
        andConditions.push({
            schedule: { startDateTime: { gte: query.startDate } },
        });
        delete query.startDate;
    }

    if (query.endDate) {
        andConditions.push({
            schedule: { endDateTime: { lte: query.endDate } },
        });
        delete query.endDate;
    }

    if (query.sortBy) delete query.sortBy;
    const orderBy = {
        schedule: {
            startDateTime: query?.sortOrder || "desc",
        },
    };

    const result = await getAllItems<DoctorSchedule & { schedule: Schedule }>(
        prisma.doctorSchedule,
        query,
        {
            filterableFields: ["isBooked"],
            andConditions: andConditions,
            include: { schedule: true },
            orderBy: orderBy as any,
            isDeletedCondition: false,
        }
    );

    return result;
};

// get all doctor schedules...........................................................................
const getDoctorSchedules = async (query: TQueryObject) => {
    if (query.isBooked && typeof query.isBooked === "string") {
        const isBookedBoolean = query.isBooked === "true";
        query.isBooked = isBookedBoolean;
    }

    const orderBy = {
        schedule: {
            startDateTime: query?.sortOrder || "asc",
        },
    };
    if (query.sortBy) delete query.sortBy;

    if (query.startDate || query.endDate) {
        query.schedule = {
            ...(query.startDate && { startDateTime: { gte: query.startDate } }),
            ...(query.endDate && { endDateTime: { lte: query.endDate } }),
        };
    }

    delete query.startDate;
    delete query.endDate;

    const result = await getAllItems<DoctorSchedule & { schedule: Schedule }>(
        prisma.doctorSchedule,
        query,
        {
            filterableFields: ["schedule", "doctorId", "isBooked"],
            include: { schedule: true },
            orderBy: orderBy as any,
            isDeletedCondition: false,
        }
    );

    return result;
};

// delete doctor schedules in bulk, similar to schedule service

const deleteDocotrSchedule = async (user: User, scheduleIds: string[]) => {
    if (
        !scheduleIds ||
        !Array.isArray(scheduleIds) ||
        scheduleIds.length === 0
    ) {
        throw new AppError(400, "No schedule IDs provided for deletion.");
    }

    const doctor = await prisma.doctor.findUnique({
        where: { email: user.email },
    });
    if (!doctor) throw new AppError(404, "Doctor not found!");

    // Find all doctorSchedules for this doctor and the given scheduleIds
    const doctorSchedules = await prisma.doctorSchedule.findMany({
        where: {
            doctorId: doctor.id,
            scheduleId: { in: scheduleIds },
        },
    });
    const foundIds = doctorSchedules.map((ds) => ds.scheduleId);
    const notFound = scheduleIds?.filter((id) => !foundIds.includes(id));
    if (notFound?.length)
        throw new AppError(
            400,
            `Doctor schedule(s) not found: ${notFound.join(", ")}`
        );

    // Check for appointments that are not completed
    const appointments = await prisma.appointment.findMany({
        where: {
            scheduleId: { in: scheduleIds },
            doctorId: doctor.id,
            status: { not: "COMPLETED" },
        },
    });
    if (appointments?.length) {
        const busyIds = appointments.map((a) => a.scheduleId);
        throw new AppError(
            400,
            `You can't delete these schedules, some appointments are booked and not completed: ${busyIds.join(", ")}`
        );
    }

    // Transactional delete

    await prisma.$transaction(async (tx) => {
        await tx.doctorSchedule.deleteMany({
            where: {
                doctorId: doctor.id,
                scheduleId: { in: scheduleIds },
            },
        });
    });
    return { deleted: scheduleIds, skipped: [] };
};

export const DoctorScheduleService = {
    createDoctorSchedule,
    getMySchedules,
    getDoctorSchedules,
    deleteDocotrSchedule,
};
