/* eslint-disable @typescript-eslint/no-empty-object-type */
import { TQueryObject } from "./common";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { User, UserRole } from "@prisma/client";
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

export type TQueryObject<T = {}> = {
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
    [key: string]: any;
} & Partial<T>;

export interface ICustomRequest extends Request {
    user: User | null;
}

// export type TAuthUser = {
//     userId: string;
//     email: string;
//     role: UserRole;
// } | null;
