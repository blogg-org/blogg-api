import fs from "fs";
import cloudinary from "../../config/cloudinary.config.js";

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
