/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Admin, User, UserRole } from "@prisma/client";


import AppError from "../../errors/AppError";
import { findUserByEmail, prisma } from "../../utls/prismaUtils";
import { passwordHash } from "../../utls/passwordHash";

const createAdmin = async (payload: User & Admin) => {
  
    const user = await findUserByEmail(payload.email);
    if (user) throw new AppError(400, "User already exists");

    const hashedPassword = await passwordHash.hashPassword(payload.password);

    const result = await prisma.$transaction(async (transactionClient) => {
        const newUser = await transactionClient.user.create({
            data: {
                email: payload.email,
                password: hashedPassword,
                role: UserRole.ADMIN,
            },
        });

        const { password, ...adminData } = payload;

        const newAdmin = await transactionClient.admin.create({
            data: adminData,
        });

        return { newUser, newAdmin };
    });

    return result;
};

export const userService = {
    createAdmin,
};
