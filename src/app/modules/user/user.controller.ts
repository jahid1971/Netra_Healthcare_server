import catchAsynch from "../../utls/catchAsynch";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { userService } from "./user.service";

const createAdmin = catchAsynch(async (req, res) => {
    const result = await userService.createAdmin(req.body.data);

    sendSuccessResponse(res, result, "Admin created successfully", 201);
});

export const userController = {
    createAdmin,
};
