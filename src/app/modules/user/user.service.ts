/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Admin,
    Doctor,
    Patient,
    User,
    UserRole,
    UserStatus,
} from "@prisma/client";

import AppError from "../../errors/AppError";
import {
    existsById,
    findUserByEmail,
    findUserById,
    prisma,
} from "../../utls/prismaUtils";
import { passwordHash } from "../../utls/passwordHash";
import getAllItems from "../../utls/getAllItems";
import { TQueryObject } from "../../types/common";

const createUser = async (
    payload: User & (Admin | Doctor | Patient) & { specialties?: string[] },
    role: UserRole,
    modelName: "admin" | "doctor" | "patient"
) => {
    const user = await findUserByEmail(payload.email);
    if (user) throw new AppError(400, "User already exists");

    const hashedPassword = await passwordHash.hashPassword(
        payload.password as string
    );

    const result = await prisma.$transaction(async (transactionClient: any) => {
        const newUser = await transactionClient.user.create({
            data: {
                email: payload.email,
                password: hashedPassword,
                role: role,
            },
        });

        const { password, specialties, ...userData } = payload;

        const newEntity = await transactionClient[modelName].create({
            data: userData,
        });

        if (role === UserRole.DOCTOR && payload.specialties) {
            const specialtyPromises = payload.specialties.map(
                async (specialtyId) => {
                    await existsById(
                        prisma.specialty,
                        specialtyId,
                        "Specialty",
                        false
                    );
                }
            );

            await Promise.all(specialtyPromises);

            await transactionClient.doctorSpecialty.createMany({
                data: payload.specialties.map((specialtyId) => ({
                    specialtyId,
                    doctorId: newEntity.id,
                })),
            });
        }

        return { [modelName]: newEntity };
    });

    return result;
};

const createAdmin = async (payload: User & Admin) => {
    return createUser(payload, UserRole.ADMIN, "admin");
};
const createDoctor = async (payload: User & Doctor) => {
    return createUser(payload, UserRole.DOCTOR, "doctor");
};

const createPatient = async (payload: User & Patient) => {
    return createUser(payload, UserRole.PATIENT, "patient");
};

const getAllUsers = async (query: TQueryObject) => {
    const result = await getAllItems(prisma.user, query, {
        searchableFields: ["email"],
        filterableFields: ["email", "role", "status"],
        andConditions: [{ status: { not: UserStatus.DELETED } }],
        isDeletedCondition: false,
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            admin: true,
            doctor: true,
            patient: true,
        },
    });

    return result;
};

const getMyProfile = async (user: User) => {
    const myProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            ...(user.role === UserRole.ADMIN && { admin: true }),
            ...(user.role === UserRole.DOCTOR && { doctor: true }),
            ...(user.role === UserRole.PATIENT && { patient: true }),
        },
    });

    return myProfile;
};

const changeUserStatus = async (userId: string, status: UserStatus) => {
    await findUserById(userId);

    const updateUser = await prisma.user.update({
        where: { id: userId },
        data: { status },
    });

    return updateUser;
};

export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    getMyProfile,
    changeUserStatus,
};
