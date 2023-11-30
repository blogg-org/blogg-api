import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
	if (!localFilePath) return null;
	// upload file on cloudinary
	try {
		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		});
		// file has been uploaded successfully
		fs.unlinkSync(localFilePath);
		return response;
	} catch (error) {
		fs.unlinkSync(localFilePath); // remove locally saved temporary file upon upload error
		return null;
	}
};

export const deleteFeaturedImageFromCloudinary = async (publicId) => {
	if (!publicId) return null;
	try {
		const response = await cloudinary.uploader.destroy(publicId, {
			invalidate: true,
			resource_type: "image",
			type: "upload",
		});
		return response;
	} catch (error) {
		return null;
	}
};
