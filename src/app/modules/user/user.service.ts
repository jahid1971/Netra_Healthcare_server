/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Admin, Doctor, Patient, User, UserRole } from "@prisma/client";

import AppError from "../../errors/AppError";
import { findUserByEmail, prisma } from "../../utls/prismaUtils";
import { passwordHash } from "../../utls/passwordHash";

const createUser = async <T extends User>(
    payload: T,
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

        const { password, ...userData } = payload;

        const newEntity = await transactionClient[modelName].create({
            data: userData,
        });

        return { newUser, newEntity };
    });

    return result;
};

// const createAdmin = async (payload: User & Admin) => {
//     const user = await findUserByEmail(payload.email);
//     if (user) throw new AppError(400, "User already exists");

//     const hashedPassword = await passwordHash.hashPassword(
//         payload.password as string
//     );

//     const result = await prisma.$transaction(async (transactionClient) => {
//         const newUser = await transactionClient.user.create({
//             data: {
//                 email: payload.email,
//                 password: hashedPassword,
//                 role: UserRole.ADMIN,
//             },
//         });

//         const { password, ...adminData } = payload;

//         const newAdmin = await transactionClient.admin.create({
//             data: adminData,
//         });

//         return { newUser, newAdmin };
//     });

//     return result;
// };

const createAdmin = async (payload: User & Admin) => {
    return createUser(payload, UserRole.ADMIN, "admin");
};
const createDoctor = async (payload: User & Doctor) => {
    return createUser(payload, UserRole.DOCTOR, "doctor");
};

const createPatient = async (payload: User & Patient) => {
    return createUser(payload, UserRole.PATIENT, "patient");
};
export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
};
