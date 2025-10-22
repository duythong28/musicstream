import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload a file buffer to Cloudinary
export const uploadToCloudinary = (fileBuffer, options) => {
  console.log("Cloudinary config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

// Generate adaptive streaming URLs
export const generateStreamingUrl = (publicId, options = {}) => {
  const { bitrate = "128k", format = "mp3", quality = "auto" } = options;

  return cloudinary.url(publicId, {
    resource_type: "video",
    format: format,
    audio_codec: format,
    bit_rate: bitrate,
    quality: quality,
    fetch_format: "auto",
  });
};

// Helper: Extract Cloudinary public_id from URL
export const extractPublicId = (url) => {
  if (!url) return null;

  try {
    const match = url.match(/\/v\d+\/(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
};
