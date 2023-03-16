import { DoctorSpecialty } from "./../../../../node_modules/.prisma/client/index.d";
import { Doctor } from "@prisma/client";
import {
    deleteUserById,
    existsById,
    prisma,
    softDeleteUserById,
} from "../../services/prisma.service";
import getAllItems from "../../utls/getAllItems";
import { TQueryObject } from "../../types/common";
import {
    doctorFilterableFields,
    doctorSearchableFileds,
} from "./doctor.constants";
import { TUpdateDoctorPayload } from "./doctor.validation";
import { sendImageToCloudinary } from "../../services/sendImageToCloudinary";

const getAllDoctors = async (query: TQueryObject<Doctor>) => {
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

    if (query.maxFees) {
        andConditions.push({ apointmentFee: { lte: Number(query.maxFees) } });
    }

    if (query.minFees) {
        andConditions.push({ apointmentFee: { gte: Number(query.minFees) } });
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

    const allDoctors = result?.data?.map((doctor) => {
        return {
            ...doctor,
            specialties: doctor.specialties.map(
                (specialty: any) => specialty.specialty
            ),
        };
    });

    return { ...result, data: allDoctors };
};

const updateDoctor = async (
    doctorId: string,
    payload: TUpdateDoctorPayload,
    file: any
) => {
    await existsById(prisma.doctor, doctorId, "Doctor");


    if (!payload) payload = {};

    if (file) {
        const uploadedImage = await sendImageToCloudinary(
            `doctor-${doctorId}`,
            file?.buffer
        );

        payload.profilePhoto = uploadedImage?.secure_url;
    }

    const { specialties, ...doctorData } = payload;

    await prisma.$transaction(async (transactionClient: any) => {
        if (specialties && specialties.length) {
            const existingSpecialties =
                await transactionClient.specialty.findMany({
                    where: { id: { in: specialties } },
                });

            if (existingSpecialties.length !== specialties?.length) {
                throw new Error("One or more specialties do not exist.");
            }

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
// get singleDoctor by id.............

const getDoctorById = async (doctorId: string) => {
    const result = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
            specialties: {
                select: { specialty: true },
            },
        },
    });

    return {
        ...result,
        specialties: result?.specialties.map(
            (specialty) => specialty.specialty
        ),
    };
};

// delete doctor by id..............

const deleteDocotr = async (doctorId: string) => {
    return await deleteUserById("doctor", doctorId);
};

// soft delete doctor by id............
const softDeleteDoctor = async (doctorId: string) => {
    return await softDeleteUserById("doctor", doctorId);
};

export const DoctorService = {
    updateDoctor,
    getAllDoctors,
    getDoctorById,
    deleteDocotr,
    softDeleteDoctor,
};
