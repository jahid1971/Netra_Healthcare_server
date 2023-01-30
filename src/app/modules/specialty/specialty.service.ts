import { Specialty } from "@prisma/client";
import { prisma } from "../../utls/prismaUtils";
import AppError from "../../errors/AppError";

const createSpecialty = async (
    specialtyData: Specialty,
    specialtyIcon: string
) => {
    const specialty = await prisma.specialty.findUnique({
        where: { title: specialtyData.title },
    });

    if (specialty) {
        throw new AppError(400, `${specialtyData.title} already exists`);
    }
    
    return await prisma.specialty.create({
        data: specialtyData,
    });
};

const getAllSpecialties = async () => {
    return await prisma.specialty.findMany();
};

const deleteSpecialty = async (id: string) => {
    return await prisma.specialty.delete({
        where: { id },
    });
};

export const SpecialtyServices = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
};
