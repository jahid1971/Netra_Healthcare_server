/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "./prisma";

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

export const findById = async (Model: any, id: string) => {
    return await Model.findUnique({
        where: { id, isDeleted: false },
    });
};
