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
		console.log("upload succeeded. ", response);
		return response;
	} catch (error) {
		fs.unlinkSync(localFilePath); // remove locally saved temporary file upon upload error
		return null;
	}
};
