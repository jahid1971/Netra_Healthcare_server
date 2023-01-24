import { Prisma } from "@prisma/client";
import { IGenericErrorResponse } from "../types/common";

const handleValidationError = (
    error: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {

    console.log("start error...",error.message, "error in validation error.................");
    return {
        statusCode: 400,
        error: "Validation Error",
        message: error.message,
        errorDetails: {
            name: error.name,
            issues: [{ path: "", message: error.message }],
        },
    };
};

export default handleValidationError;
