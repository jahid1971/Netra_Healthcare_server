import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsynch = (fn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.log(
                err,
                "errorr in catchAsynch .........................................."
            );
            next(err);
        });
    };
};
export default catchAsynch;
