/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import AppError from "../errors/AppError";

import catchAsync from "../utls/catchAsync";
import { jwtToken } from "../utls/jwtToken";
import config from "../config";
import { User, UserRole } from "@prisma/client";
import { prisma } from "../utls/prismaUtils";
import { ICustomRequest } from "../types/common";

const checkAuth = (...requiredRoles: Array<UserRole>) => {
  return catchAsync(
    async (req: ICustomRequest, res: Response, next: NextFunction) => {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new AppError(401, "Unauthorized access");
      }

      const decodedToken = jwtToken.verifyToken(
        token,
        config.jwt_access_secret as string,
        "Access Token",
      );

      const { userId, role } = decodedToken;

      // checking if the user is exist
      const user = (await prisma.user.findUnique({
        where: { id: userId },
      })) as User;

      if (!user) throw new AppError(404, "User is not found !");

      if (user.status === "BLOCKED")
        throw new AppError(403, "This user is blocked !");

      if (user.status === "DELETED")
        throw new AppError(403, "User is deleted !");

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(401, "You are not authorized !");
      }

      req.user = user;

      next();
    },
  );
};

export default checkAuth;
