import { NextFunction, Request, Response } from "express";

import multer from "multer";

export const handleImageUpload = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //using multer memory storage to create a buffer of the image
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    const uploadMiddleware = upload.single("file");

    uploadMiddleware(req, res, (err) => {
        console.log(err, "error in handle image.......");

        if (err) return next(err);

        if (typeof req.body.data === "string") {
            try {
                req.body.data = JSON.parse(req.body.data);
            } catch (parseError) {
                return next(parseError);
            }
        }

        next();
    });
};
