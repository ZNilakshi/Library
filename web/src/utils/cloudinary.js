import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
export { cloudinary }; // Export the cloudinary instance

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'profile_photos', // Optional: specify a folder in Cloudinary
    });
    return result.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export const uploadFile = async (file, folder, resourceType = 'image') => {
  try {
    // Convert the file to a base64 string
    const fileBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(fileBuffer).toString('base64');

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64File}`,
      {
        folder,
        resource_type: resourceType,
      }
    );

    return result.secure_url; // Return the secure URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};           