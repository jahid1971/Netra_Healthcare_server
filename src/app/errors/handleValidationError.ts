/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const handleValidationError = (err: mongoose.Error.ValidationError): any => {
    const errorIssues: any = Object.values(err.errors).map((value) => {
        return {
            path: value.path,
            message: value.message,
        };
    });
    return {
        statusCode: 400,
        message: "Validation Error",
        errorMessage: errorIssues.map((value: any) => value.message).join(" "),
        errorDetails: {
            issues: errorIssues,
            name: err.name,
        },
    };
};

export default handleValidationError;
