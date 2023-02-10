import { TSchedule } from "./schedule.validation";
import { toZonedTime } from "date-fns-tz";
import { addDays, addMinutes, format } from "date-fns";
import config from "../../config";
import { Schedule, User, UserRole } from "@prisma/client";
import { prisma } from "../../utls/prismaUtils";
import getAllItems from "../../utls/getAllItems";
import { TQueryObject } from "../../types/common";

const createSchedule = async (payload: TSchedule): Promise<Schedule[]> => {
    const interverlTime = payload.duration || 30;

    const schedules = [];

    const timeZone =
        payload.timeZone ||
        config.timeZone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;

    let startDate = toZonedTime(new Date(payload.startDate), timeZone);
    const endDate = toZonedTime(new Date(payload.endDate), timeZone);
    const startTime = toZonedTime(new Date(payload.startTime), timeZone);
    let endTime = toZonedTime(new Date(payload.endTime), timeZone);

    const formattedStartDate = format(startDate, "yyyy-MM-dd"); // retrieve only date from startDate

    const formattedStartTime = format(startTime, "HH:mm:ss"); // retrieve only time  from startTime

    let startDateTime = new Date(`${formattedStartDate}T${formattedStartTime}`); //new date object with date and time

    while (startDate <= endDate) {
        let slotStartTime = startDateTime;

        while (slotStartTime < endTime) {
            const slotEndTime = addMinutes(slotStartTime, interverlTime);

            const scheduleData = {
                startDateTime: new Date(slotStartTime),
                endDateTime: new Date(slotEndTime),
            };

            const existingSchedule = await prisma.schedule.findFirst({
                where: { ...scheduleData },
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData,
                });

                schedules.push(result);
            }

            slotStartTime = slotEndTime;
        }

        endTime = addDays(endTime, 1);

        startDate = addDays(startDate, 1);
        startDateTime = addDays(startDateTime, 1);
    }

    return schedules;
};

const getAllSchedules = async (query: TQueryObject<Schedule>, user) => {
    const andConditions = [];

    if (query.startDate && query.endDate) {
        andConditions.push({
            startDateTime: {
                gte: query.startDate,
            },
            endDateTime: {
                lte: query.endDate,
            },
        });
    }

    if (user?.role === UserRole.DOCTOR) {
        const doctorSchedules = await prisma.doctorSchedule.findMany({
            where: {
                doctor: { email: user.email },
            },
        });

        const scheduleIds = doctorSchedules.map(
            (doctorSchedule) => doctorSchedule.scheduleId
        );

        andConditions.push({
            id: {
                notIn: scheduleIds,
            },
        });
    }
    
    const result = await getAllItems<Schedule>(prisma.schedule, query, {
        filterableFields: ["startDateTime", "endDateTime"],
        andConditions: andConditions,
    });

    return result;
};

export const ScheduleService = {
    createSchedule,
    getAllSchedules,
};
