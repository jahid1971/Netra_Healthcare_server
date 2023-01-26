import { Response } from "express";

export type TMetaData = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
export type TResponse<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    metaData?: TMetaData;
};
const sendSuccessResponse = <T>(
    res: Response,
    data: T,
    message: string,
    statusCode: number = 200,
    metaData?: TMetaData
) => {
    const responseData: TResponse<T> = {
        success: true,
        statusCode: statusCode,
        message: message,
        data: data,
        metaData: metaData,
    };

    return res.status(statusCode).json(responseData);
};

export default sendSuccessResponse;
