import { Response } from "express";

type TMetaData = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
type TResponse<T> = {
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
    statusCode?: number,
    metaData?: TMetaData
) => {
    const status = statusCode ? statusCode : 200;

    const responseData: TResponse<T> = {
        success: true,
        statusCode: status,
        message: message,
        data: data,
        metaData: metaData,
    };
    console.log("success response");

    return status !== 200 ? res.status(status).json(responseData) : res.status(200).json(responseData);
};

export default sendSuccessResponse;
