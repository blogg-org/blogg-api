import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

// get all users
export const handleGetAllUsers = async (req, res) => {
	try {
		const allUsers = await User.find();
		if (allUsers.length === 0) {
			res.status(404).json(
				new ApiResponse(404, null, "No user is created")
			);
		} else {
			res.status(200).json(new ApiResponse(200, allUsers));
		}
	} catch (error) {
		res.status(500).json(new ApiResponse(500, null, `${error.message}`));
	}
};

// get single user by userId
export const handleGetUserById = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId);
		if (user === null) {
			res.status(404).json(new ApiResponse(404, null, "User not found."));
		} else {
			res.status(200).json(new ApiResponse(200, user));
		}
	} catch (error) {
		res.status(500).json(new ApiResponse(500, null, `${error.message}`));
	}
};
