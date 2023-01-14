import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsynch = (fn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => { 
            console.log(req.body, "in err of catchAsync req.body", err, 'err');
            next(err);
        });
    };
};
export default catchAsynch;
