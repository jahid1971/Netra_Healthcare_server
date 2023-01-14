import { upload } from "../utls/sendImageToCloudinary";

export const handleImageUpload = (req, res, next) => {
    const uploadMiddleware = upload.single('file');
  
    // Apply multer middleware conditionally
    uploadMiddleware(req, res, (err) => {
        if (err) return next(err)
        next();
    });
  };
