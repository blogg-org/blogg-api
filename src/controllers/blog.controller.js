import {
	uploadOnCloudinary,
	deleteFeaturedImageFromCloudinary,
} from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import { Blog } from "../models/blog.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
==============================================
BLOG CONTROLLER - GET ALL BLOGS
==============================================
 */
export const handleGetAllBlogs = asyncHandler(async (req, res) => {
	const blogs = await Blog.find();
	return res.status(200).json(new ApiResponse(200, blogs));
});

/*
==============================================
BLOG CONTROLLER - ADD NEW BLOG
==============================================
 */
export const handleAddNewBlog = asyncHandler(async (req, res) => {
	const { title, slug, content, status } = req.body;

	if (!title || !slug || !content || !status) {
		return res
			.status(400)
			.json(new ApiError(400, "All fields are required").toJSON());
	}

	const featuredImageLocalPath = req.file?.path;
	if (!featuredImageLocalPath) {
		return res
			.status(400)
			.json(new ApiError(400, "featured image is required").toJSON());
	}

	const featuredImageFromCloudinary = await uploadOnCloudinary(
		featuredImageLocalPath
	);
	if (!featuredImageFromCloudinary) {
		return res
			.status(500)
			.json(
				new ApiError(
					500,
					"Error while uploading cover image. Please try again."
				).toJSON()
			);
	}

	const { _id } = req.user; // author
	const blog = await Blog.create({
		title: title,
		slug: slug,
		content: content,
		status: status,
		featuredImage: {
			url: featuredImageFromCloudinary.secure_url,
			publicId: featuredImageFromCloudinary.public_id,
		},
		author: _id,
	});

	if (!blog) {
		return res
			.status(500)
			.json(
				new ApiError(
					500,
					"Something went wrong while adding new blog."
				).toJSON()
			);
	}
	return res
		.status(201)
		.json(new ApiResponse(201, blog, "Blog created successfully."));
});

/*
==============================================
BLOG CONTROLLER - REMOVE BLOG
==============================================
 */
export const handleRemoveBlog = asyncHandler(async (req, res) => {
	// get blogId from route url using req.params
	const { blogId } = req.params;

	// find blog using blogId
	const blog = await Blog.findById(blogId);
	if (!blog) {
		return res
			.status(404)
			.json(new ApiError(404, "Could not find blog.").toJSON());
	}

	// if blog is found, then check author
	// only author can delete blog
	const user = req.user;
	if (user._id !== blog.author.toString()) {
		return res
			.status(403)
			.json(new ApiError(403, "You are not allowed to delete.").toJSON());
	}

	const deleteResponse = await Blog.deleteOne({ _id: blog._id });
	if (!deleteResponse?.acknowledged) {
		return res
			.status(500)
			.json(new ApiError(500, "Error occured while deleting.").toJSON());
	}

	// after blog is deleted from database, delete associated featured image from cloudinary
	const deleteFeaturedImageResponse = await deleteFeaturedImageFromCloudinary(
		blog.featuredImage.publicId
	);

	return res
		.status(200)
		.json(new ApiResponse(200, blog, "Deleted successfully."));
});

/*
==============================================
BLOG CONTROLLER - UPDATE BLOG
==============================================
 */
export const handleUpdateBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.params;

	// Validate if the blogId is valid
	if (!blogId) {
		return res
			.status(400)
			.json(new ApiError(400, "Invalid operation").toJSON());
	}

	// Retrieve existing blog by ID
	const existingBlog = await Blog.findById(blogId);

	// Check if the blog exists
	if (!existingBlog) {
		return res
			.status(404)
			.json(new ApiError(404, "Blog not found").toJSON());
	}

	// if blog is found, then check author
	// only author can update blog
	const user = req.user;
	if (user._id !== existingBlog.author.toString()) {
		return res
			.status(403)
			.json(new ApiError(403, "You are not allowed to update.").toJSON());
	}

	// Extract updated data from the request body
	const { title, slug, content, status } = req.body;

	// Handle updated featured image, if provided
	let featuredImageUrl = existingBlog.featuredImage.url; // Default to existing image

	const featuredImageLocalPath = req.file?.path;
	if (featuredImageLocalPath) {
		const featuredImageFromCloudinary = await uploadOnCloudinary(
			featuredImageLocalPath
		);
		if (!featuredImageFromCloudinary) {
			return res
				.status(500)
				.json(
					new ApiError(
						500,
						"Error while uploading cover image. Please try again."
					).toJSON()
				);
		}
		featuredImageUrl = featuredImageFromCloudinary.secure_url;
	}

	// Update the blog with the new data
	existingBlog.title = title || existingBlog.title;
	existingBlog.slug = slug || existingBlog.slug;
	existingBlog.content = content || existingBlog.content;
	existingBlog.status = status || existingBlog.status;
	existingBlog.featuredImage.url = featuredImageUrl;

	// Save the updated blog
	const updatedBlog = await existingBlog.save();

	if (!updatedBlog) {
		return res
			.status(500)
			.json(
				new ApiError(
					500,
					"Error while updating. Please try again."
				).toJSON()
			);
	}

	// Respond with the updated blog
	return res
		.status(200)
		.json(new ApiResponse(200, updatedBlog, "Blog updated successfully."));
});
