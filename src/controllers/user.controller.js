import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
==============================================
USER CONTROLLER - GET ALL USERS
==============================================
 */
export const handleGetAllUsers = asyncHandler(async (req, res) => {
	const allUsers = await User.find().select("-password -refreshToken");
	if (allUsers.length === 0) {
		return res
			.status(404)
			.json(new ApiError(404, "No user is create").toJSON());
	}

	res.status(200).json(new ApiResponse(200, allUsers));
});

/*
==============================================
USER CONTROLLER - GET CURRENT USER
==============================================
 */
export const handleGetCurrentUser = asyncHandler(async (req, res) => {
	const user = req.user;
	console.log("\n:: user.controller => handleGetCurrentUser => user: ", user);

	const userFromDB = await User.findById(user._id).select(
		"-password -refreshToken"
	);
	if (!userFromDB) {
		return res
			.status(404)
			.json(new ApiError(404, "User not found").toJSON());
	}
	return res.status(200).json(new ApiResponse(200, userFromDB));
});
