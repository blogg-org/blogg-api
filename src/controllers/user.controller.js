import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

// signup - create new user
export const handleSignup = async (req, res) => {
	try {
		const { fullname, email, password } = req.body;
		if (!fullname || !email || !password) {
			return res
				.status(400)
				.json(new ApiResponse(400, null, "All fields are required."));
		}
		const user = new User({ fullname, email, password });
		const userFromDB = await user.save();
		userFromDB.password = undefined;
		res.status(201).json(new ApiResponse(201, null, "Sign up successful."));
	} catch (error) {
		if (error.code === 11000 && error.keyPattern.email) {
			error.message = "email is already used";
		} else if (error.errors && Object.keys(error.errors).length > 0) {
			if (error.errors.fullname?.kind === "required") {
				error.message += " fullname is required";
			}
			if (error.errors.email?.kind === "required") {
				error.message = " email is required";
			}
			if (error.errors.password?.kind === "required") {
				error.message += " password is required";
			}
		}
		console.log("\n:: Error", error.message);
		res.status(400).json(new ApiResponse(400, null, error.message));
	}
};

// signin - handle login
export const handleSignin = async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log(email, password);
		if (!email || !password) {
			return res
				.status(400)
				.json(new ApiResponse(400, null, "All fields are required."));
		}
		const user = await User.findOne({ email });
		if (!user) {
			res.status(401).json(
				new ApiResponse(400, null, "Invalid credentials")
			);
		} else {
			const isPasswordMatched = await user.comparePassword(password);
			if (!isPasswordMatched) {
				res.status(401).json(
					new ApiResponse(401, null, "Invalid password")
				);
			} else {
				// generate access token and send cookie response
				const accessToken = user.generateAccessToken();
				res.cookie("access_token", accessToken, {
					expires: new Date(Date.now() + 30 * 1000), // expires in 1 hour
					httpOnly: true,
					secure: true,
					sameSite: "None",
				});

				// generate refresh token and save into the database
				const refreshToken = user.generateRefreshToken();
				user.refreshToken = refreshToken;
				await user.save();
				res.cookie("refresh_token", refreshToken, {
					expires: new Date(Date.now() + 30 * 1000), // expires in 10 days
					httpOnly: true,
					secure: true,
					sameSite: "None",
				});

				user.password = undefined;
				user.refreshToken = undefined;
				res.status(200).json(
					new ApiResponse(200, null, "Sign in successful")
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

// signout - logout

// update user

// delete user
