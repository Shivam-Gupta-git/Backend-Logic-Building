import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name:
      process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:
      process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET_KEY,
  });
  console.log(
    "Cloudinary configured with cloud_name:",
    process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME
  );
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
export default connectCloudinary;
