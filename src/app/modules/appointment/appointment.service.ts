/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Appointment,
    AppointmentStatus,
    PaymentStatus,
    User,
    UserRole,
} from "@prisma/client";
import { existsById, prisma } from "../../utls/prismaUtils";
import AppError from "../../errors/AppError";
import { v4 as uuidv4 } from "uuid";
import { sslService } from "../../services/sslCommerz";
import getAllItems from "../../utls/getAllItems";
import { TQueryObject } from "../../types/common";

const createAppointment = async (data: Appointment, user: User) => {
    const isDoctorExists = await existsById(
        prisma.doctor,
        data.doctorId,
        "Doctor"
    );

    const patient = await prisma.patient.findUnique({
        where: { email: user.email },
    });
    if (!patient) throw new AppError(404, "Patient not found");

    const isDoctorScheduleExists = await prisma.doctorSchedule.findFirst({
        where: {
            doctorId: data.doctorId,
            scheduleId: data.scheduleId,
            isBooked: false,
        },
    });

    if (!isDoctorScheduleExists) {
        throw new AppError(404, "Doctor schedule not found!");
    }

    const videoCallingId: string = uuidv4();

    const result = await prisma.$transaction(async (tx) => {
        const appointment = await tx.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: data.doctorId,
                scheduleId: data.scheduleId,
                videoCallingId,
            },
            include: {
                doctor: true,
                schedule: true,
                patient: true,
            },
        });

        await tx.doctorSchedule.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: isDoctorExists.id,
                    scheduleId: data.scheduleId,
                },
            },
            data: {
                isBooked: true,
                appointmentId: appointment.id,
            },
        });

        const transactionId = `${appointment.id}-${Date.now()}`;

        const payment = await tx.payment.create({
            data: {
                appointmentId: appointment.id,
                amount: appointment.doctor.apointmentFee,
                transactionId,
            },
        });

        const initPayment = await sslService.initPayment(payment, patient);

        return initPayment;
    });

    return {
        paymentUrl: result.GatewayPageURL,
    };
};

// get my appointments...........................................................................................
const getMyAppointments = async (user: User, query: TQueryObject) => {
    const andCondtion = [];

    if (user.role === UserRole.DOCTOR) {
        andCondtion.push({
            doctor: {
                email: user.email,
            },
        });
    } else {
        andCondtion.push({
            patient: {
                email: user.email,
            },
        });
    }

    andCondtion.push({
        status: {
            not: AppointmentStatus.PENDING,
        },
    });

    const myAppointments = await getAllItems<any>(prisma.appointment, query, {
        andConditions: andCondtion,
        filterableFields: ["status", "doctorId", "patientId", "scheduleId"],
        include:
            user.role === UserRole.DOCTOR
                ? { patient: true, schedule: true }
                : { doctor: true, schedule: true },
    });

    return myAppointments;
};

// get all appointments........................................................................................
const getAllAppointments = async (query: TQueryObject) => {
    const appointments = await getAllItems<any>(prisma.appointment, query, {
        include: {
            doctor: true,
            patient: true,
            schedule: true,
        },
    });

    return appointments;
};

// change appointment status.....................................................................................

const changeAppointmentStatus = async (
    appointmentId: string,
    status: AppointmentStatus,
    user: User
) => {
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId, paymentStatus: PaymentStatus.PAID },
        include: { doctor: true },
    });

    if (!appointment) {
        throw new AppError(404, "Appointment not found ");
    }

    if (
        user.role === UserRole.DOCTOR &&
        appointment.doctor.email !== user.email
    ) {
        throw new AppError(
            403,
            "You are not authorized to change appointment status"
        );
    }

    if (user.role === UserRole.DOCTOR)
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status },
        });

    return {
        message: "Appointment status changed successfully",
    };
};

// clean unpaid appointments after every 30 minutes............................................................
const cleanUnpaidAppointments = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const unpaidAppointments = await prisma.appointment.findMany({
        where: {
            paymentStatus: PaymentStatus.UNPAID,
            createdAt: {
                lte: thirtyMinutesAgo,
            },
        },
    });

    if (unpaidAppointments.length === 0) return;

    const unpaidAppointmentIds = unpaidAppointments.map((a) => a.id);

    await prisma.$transaction(async (tx) => {
        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: unpaidAppointmentIds,
                },
            },
        });

        await tx.appointment.deleteMany({
            where: {
                id: {
                    in: unpaidAppointmentIds,
                },
            },
        });

        for (const appointment of unpaidAppointments) {
            await tx.doctorSchedule.update({
                where: {
                    doctorId_scheduleId: {
                        doctorId: appointment.doctorId,
                        scheduleId: appointment.scheduleId,
                    },
                },
                data: {
                    isBooked: false,
                    appointmentId: null,
                },
            });
        }

        console.info(
            "Unpaid appointments cleaned successfully:",
            unpaidAppointmentIds
        );
    });
};

export const AppointmentService = {
    createAppointment,
    getMyAppointments,
    getAllAppointments,
    changeAppointmentStatus,
    cleanUnpaidAppointments,
};
