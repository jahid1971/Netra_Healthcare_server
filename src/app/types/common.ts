/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from "@prisma/client";
import { Request } from "express";

export interface IErrorIssue {
    path?: string;
    message: string;
    [key: string]: any;
}

export interface IGenericErrorResponse {
    statusCode: number;
    error: string;
    message: string;
    errorDetails: {
        issues: IErrorIssue[] | string;
        name: string;
    };
}

export interface IQueryParams {
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
    [key: string]: any;
}

export interface ICustomRequest extends Request {
    user?: User;
}
