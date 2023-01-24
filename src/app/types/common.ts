/* eslint-disable @typescript-eslint/no-explicit-any */

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
        issues: IErrorIssue[];
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
