import { Admin } from "@prisma/client";
import { IQueryParams } from "../../types/common";
import getAllItems from "../../utls/getAllItems";
import prisma from "../../utls/prisma";
import { findById } from "../../utls/utls.common";
import AppError from "../../errors/AppError";

const getAllLAdmin = async (query: IQueryParams) => {
    const result = getAllItems(prisma.admin, query, {
        searchableFields: ["name", "email"],
        filterableFields: ["name", "email"],
    });

    return result;
};

const getAdminById = async (id: string) => {
    const result = await findById(prisma.admin, id);
    return result;
};

const updateAdmin = async (id: string, payload: Partial<Admin>) => {
    const admin = await findById(prisma.admin, id);
    if (!admin) throw new AppError(404, "Admin not found");

    const result = await prisma.admin.update({
        where: { id },
        data: payload,
    });

    return result;
};

export const adminService = {
    getAllLAdmin,
    getAdminById,
    updateAdmin,
};
