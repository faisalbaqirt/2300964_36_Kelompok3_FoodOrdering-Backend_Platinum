require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadCloudinary = async (image, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: folderName,
      use_filename: true,
      unique_filename: false,
    });

    return result.url;
  } catch (error) {
    throw error;
  }
};
