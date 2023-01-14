/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { ErrorRequestHandler } from "express";
import handleValidationError from "../errors/handleValidationError";
// import { ICastErrorResult, TErrorResponse } from "../interface/error";
import mongoose from "mongoose";
import { ZodError } from "zod";
import handlerZodError from "../errors/handleZodEror";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleBSONError from "../errors/handleBsonError";
import { BSONError } from "bson";

// eslint-disable-next-line no-unused-vars
const globalErrorHandler: ErrorRequestHandler  = (err, req, res, next) => {


    let errorResponse: any  = {
        statusCode: err.statusCode || 500,
        message: err.name || "Something went wrong",
        errorMessage: err.message || "Something went wrong",
        errorDetails: {
            issues: err.issues || [],
            name: err.name || "",
        },
    };

    if (err instanceof ZodError) errorResponse = handlerZodError(err);
    else if (err instanceof mongoose.Error.ValidationError) errorResponse = handleValidationError(err);
    else if (err instanceof mongoose.Error.CastError) errorResponse = handleCastError(err);
    else if (err?.code === 11000) errorResponse = handleDuplicateError(err);
    else if (err instanceof BSONError) errorResponse = handleBSONError(err);
    // else if (err instanceof AppError) errorResponse.statusCode = err.statusCode;

    return res.status(errorResponse.statusCode).json({
        success: false,
        message: errorResponse.message,
        errorMessage: errorResponse.errorMessage,
        errorDetails: errorResponse.errorDetails,
        stack: err?.stack 
    });
};

export default globalErrorHandler;
