import cloudinary from "cloudinary";

let cld = cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageUploadToCloudinary =async (imagePath:any) => {
    const result = await cloudinary.v2.uploader.upload(imagePath);
    return result
};
