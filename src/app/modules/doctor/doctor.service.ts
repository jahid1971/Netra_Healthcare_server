/* eslint-disable @typescript-eslint/no-explicit-any */
import { DoctorSpecialty } from "./../../../../node_modules/.prisma/client/index.d";
import { Doctor } from "@prisma/client";
import {
    deleteUserById,
    findById,
    prisma,
    softDeleteUserById,
} from "../../utls/prismaUtils";
import getAllItems from "../../utls/getAllItems";
import { TQueryObject } from "../../types/common";
import {
    doctorFilterableFields,
    doctorSearchableFileds,
} from "./doctor.constants";
import { TUpdateDoctorPayload } from "./doctor.validation";

const getAllDoctors = async (query: TQueryObject) => {
    const andConditions = [];

    const specialtyIds = Array.isArray(query.specialties)
        ? query.specialties
        : [query.specialties];

    if (query.specialties) {
        andConditions.push({
            specialties: {
                some: {
                    specialtyId: {
                        in: specialtyIds,
                    },
                },
            },
        });
    }
    const searchConditions = [];

    if (query.searchTerm) {
        searchConditions.push({
            specialties: {
                some: {
                    specialty: {
                        title: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    }

    const result = await getAllItems<
        Doctor & { specialties: DoctorSpecialty[] }
    >(prisma.doctor, query, {
        searchableFields: doctorSearchableFileds as (keyof Doctor)[],

        filterableFields: doctorFilterableFields as (keyof Doctor)[],

        andConditions,

        include: { specialties: { select: { specialty: true } } },

        extraSearchConditions: searchConditions,
    });

    return result;
};

const updateDoctor = async (
    doctorId: string,
    payload: TUpdateDoctorPayload
) => {
    await findById(prisma.doctor, doctorId, "Doctor");

    const { specialties, ...doctorData } = payload;

    await prisma.$transaction(async (transactionClient: any) => {
        if (specialties && specialties.length) {
            await transactionClient.doctorSpecialty.deleteMany({
                where: { doctorId },
            });

            await transactionClient.doctorSpecialty.createMany({
                data: specialties.map((specialtyId) => ({
                    specialtyId,
                    doctorId,
                })),
            });
        }

        return await transactionClient.doctor.update({
            where: { id: doctorId },
            data: doctorData,
        });
    });

    const responseData = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
            specialties: {
                select: { specialty: true },
            },
        },
    });

    return responseData;
};

const deleteDocotr = async (doctorId: string) => {
    return await deleteUserById("doctor", doctorId);
};

const softDeleteDoctor = async (doctorId: string) => {
    return await softDeleteUserById("doctor", doctorId);
};

export const DoctorService = {
    updateDoctor,
    getAllDoctors,
    deleteDocotr,
    softDeleteDoctor,
};
