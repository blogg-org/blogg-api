import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

// signup - create new user
export const handleSignup = async (req, res) => {
	try {
		const { fullname, email, password } = req.body;
		const user = new User({ fullname, email, password });
		const userFromDB = await user.save();
		res.status(201).json(
			new ApiResponse(201, userFromDB, "Sign up successful.")
		);
	} catch (error) {
		console.log("\n:: Error: ", error.message);
		res.status(400).json(new ApiResponse(400, null, error.message));
	}
};

// signin - handle login
export const handleSignin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (user === null) {
			res.status(401).json(
				new ApiResponse(401, null, "Invalide credentials")
			);
		} else {
			const isPasswordMatched = await user.comparePassword(password);
			if (!isPasswordMatched) {
				res.status(401).json(
					new ApiResponse(401, null, "Invalid password")
				);
			} else {
				res.status(200).json(
					new ApiResponse(200, user, "Sign in successful")
				);
			}
		}
	} catch (error) {
		console.error(error);
		res.status(500).json(
			new ApiResponse(500, null, "Internal server error")
		);
	}
};

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
