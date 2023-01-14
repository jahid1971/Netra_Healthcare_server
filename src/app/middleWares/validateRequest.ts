import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsynch from '../utls/catchAsynch';



const validateRequest = (schema: AnyZodObject) => {
  return catchAsynch(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync(req.body);

    next();
  });
};

export default validateRequest;