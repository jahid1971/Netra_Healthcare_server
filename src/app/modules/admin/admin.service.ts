import { Admin } from "@prisma/client";
import { IQueryParams } from "../../types/common";
import getAllItems from "../../utls/getAllItems";

import {
    deleteById,
    findById,
    prisma,
    softDeleteById,
} from "../../utls/prismaUtils";

const getAllLAdmin = async (query: IQueryParams) => {
    const result = getAllItems(prisma.admin, query, {
        searchableFields: ["name", "email"],
        filterableFields: ["name", "email"],
    });

    return result;
};

const getAdminById = async (id: string) => {
    const result = await findById(prisma.admin, id, "Admin");
    return result;
};

const updateAdmin = async (id: string, payload: Partial<Admin>) => {
    await findById(prisma.admin, id);

    const result = await prisma.admin.update({
        where: { id },
        data: payload,
    });

    return result;
};

const deleteAdmin = async (id: string) => {
    const deletedAdmin = await deleteById("admin", id);
    return deletedAdmin;
};

const softDelete = async (id: string) => {
    const deletedAdmin = await softDeleteById("admin", id);
    return deletedAdmin;
};

export const adminService = {
    getAllLAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    softDelete,
};
