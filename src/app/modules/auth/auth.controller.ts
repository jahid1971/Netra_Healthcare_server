/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsynch from "../../utls/catchAsynch";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { authServices } from "./auth.service";



const logIn = catchAsynch(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, userObject } = await authServices.logIn(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
    });
    const data = {
        user: userObject,
        token: accessToken,
    };
    sendSuccessResponse(res, data, "User logged in successfully", 200);
});

const changePassword = catchAsynch(async (req: Request, res: Response) => {
    const result = await authServices.changePassword((req as any).user._id, req.body);

    return sendSuccessResponse(res, result, "Password changed successfully", 200);
});

export const authControllers = {
    logIn,
    changePassword,
};
