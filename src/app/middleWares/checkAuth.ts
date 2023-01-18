/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";

import catchAsynch from "../utls/catchAsynch";
import { jwtToken } from "../utls/jwtToken";
import config from "../config";
import { User, UserRole } from "@prisma/client";
import prisma from "../utls/prisma";

const checkAuth = (...requiredRoles: Array<UserRole>) => {
    return catchAsynch(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;

            if (!token) {
                throw new AppError(401, "Unauthorized access");
            }

            const decodedToken = jwtToken.verifyToken(
                token,
                config.jwt_access_secret as string
            );
            const { id, role } = decodedToken;

            // checking if the user is exist
            const user = (await prisma.user.findUnique({
                where: { id: id as string },
            })) as User;

            if (!user) throw new AppError(404, "User is not found !");

            if (user.status === "BLOCKED")
                throw new AppError(403, "This user is blocked !");
            if (user.status === "DELETED")
                throw new AppError(403, "User is deleted !");

            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError(401, "You are not authorized !");
            }

            (req as any).user = user;

            next();
        }
    );
};

export default checkAuth;
