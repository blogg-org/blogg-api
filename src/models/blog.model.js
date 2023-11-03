import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			maxLength: 255,
		},
		slug: {
			type: String,
			required: true,
			maxLength: 255,
		},
		content: {
			type: String,
			required: true,
		},
		featuredImage: {
			type: String,
			required: true,
			maxLength: 255,
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
