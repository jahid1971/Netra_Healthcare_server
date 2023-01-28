import { v2 as cloudinary } from "cloudinary";
import config from "../config";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = (imageName: string, buffer: string) => {
  // Upload an image from buffer
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: `product-/${imageName}` },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );

    // Write the buffer to the upload stream
    uploadStream.end(buffer);
  });
};
