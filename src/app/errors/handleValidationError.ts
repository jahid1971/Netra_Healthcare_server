import { Prisma } from "@prisma/client";
import { IGenericErrorResponse } from "../types/common";

const handleValidationError = (
    error: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {
    return {
        statusCode: 400,
        error: "Validation Error",
        message: error.message,
        errorDetails: {
            issues: [{ path: "", message: error.message }],
            name: error.name,
        },
    };
};

export default handleValidationError;
