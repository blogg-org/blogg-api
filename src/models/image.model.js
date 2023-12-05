import mongoose from "mongoose";

export const imageSchema = new mongoose.Schema({
	publicId: {
		type: String,
	},
	url: {
		type: String,
		required: true,
	},
});
