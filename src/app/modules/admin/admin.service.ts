import { Admin } from "@prisma/client";
import { TQueryObject } from "../../types/common";
import getAllItems from "../../utls/getAllItems";

import {
  deleteUserById,
  findById,
  prisma,
  softDeleteUserById,
} from "../../utls/prismaUtils";

const getAllLAdmin = async <Admin>(query: TQueryObject) => {
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
  const deletedAdmin = await deleteUserById("admin", id);
  return deletedAdmin;
};

const softDelete = async (id: string) => {
  const deletedAdmin = await softDeleteUserById("admin", id);
  return deletedAdmin;
};

export const adminService = {
  getAllLAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDelete,
};
