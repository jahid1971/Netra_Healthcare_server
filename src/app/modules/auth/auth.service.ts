/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { passwordHash } from "../../utls/passwordHash";

import User from "../user/user.model";
import { jwtToken } from "../../utls/jwtToken";
import config from "../../config";

// logIn......................logIn

const logIn = async (payload: { email: string; password: string }) => {
    const user = await User.findOne({ email: payload.email }).select("+password");

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const plainPassword = payload.password;
    const hashedPassword = user.password;

    const isPasswordMatched = await passwordHash.comparePassword(plainPassword, hashedPassword);

    if (!isPasswordMatched) throw new AppError(404, "Invalid password");

    const jwtPayload: JwtPayload = {
        id: user._id,
        role: user.role,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
    };

    const accessToken = jwtToken.createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expiry as string
    );

    const refreshToken = jwtToken.createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expiry as string
    );

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...userObject } = (user as any).toObject();

    return { accessToken, refreshToken, userObject };
};

// changePassword......................changePassword
const changePassword = async (id: string, payload: { oldPassword: string; newPassword: string }) => {
    const user = await User.findById(id).select("+password");

    if (!user) throw new AppError(404, "User not found");

    const isPasswordMatched = await passwordHash.comparePassword(payload.oldPassword, user?.password);
    if (!isPasswordMatched) throw new AppError(404, "Old Password Is Incorrect");

    const isOldAdnNewPasswordSame = await passwordHash.comparePassword(payload.newPassword, user?.password);
    if (isOldAdnNewPasswordSame) throw new AppError(404, "New password can't be same as old password");

    const hashedPassword = await passwordHash.hashPassword(payload.newPassword);

    const result = await User.findByIdAndUpdate(
        id,
        { password: hashedPassword, needsPasswordChange: false },
        { new: true }
    );
    return result;
};

export const authServices = {
    logIn,
    changePassword,
};
