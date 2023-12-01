import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import totp from "../../config/totp.config.js";
import { sendMail } from "../utils/sendMail.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
==============================================
AUTH CONTROLLER - SIGNUP
==============================================
 */
export const handleSignup = asyncHandler(async (req, res) => {
	const { fullname, email, password } = req.body;
	// console.log(fullname, email, password);

	if (!fullname || !email || !password) {
		return res
			.status(400)
			.json(new ApiError(400, "All fields are required").toJSON());
	}

	const existedUser = await User.findOne({ email });
	if (existedUser) {
		return res
			.status(409)
			.json(new ApiError(409, "Email is already used").toJSON());
	}

	const user = new User({ fullname, email, password });
	const userFromDB = await user.save();
	if (userFromDB) {
		return res
			.status(201)
			.json(new ApiResponse(201, null, "Sign up successful"));
	} else {
		return res
			.status(500)
			.json(
				new ApiError(
					500,
					"Something went wrong while signing up"
				).toJSON()
			);
	}
});

/*
==============================================
AUTH CONTROLLER - SIGNIN
==============================================
 */
export const handleSignin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// validate input fields
	if (!email || !password) {
		return res
			.status(400)
			.json(new ApiError(400, "All fields are required").toJSON());
	}

	// find user with unique email id
	const user = await User.findOne({ email });
	if (!user) {
		return res
			.status(401)
			.json(new ApiError(401, "Invalid credentials").toJSON());
	}

	// compare password
	const isPasswordMatched = await user.comparePassword(password);
	if (!isPasswordMatched) {
		return res
			.status(401)
			.json(new ApiError(401, "Invalid credentials").toJSON());
	}

	// generate refresh token and save into the database
	const refreshToken = user.generateRefreshToken();
	user.refreshToken = refreshToken;
	await user.save();
	res.cookie("refresh_token", refreshToken, {
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expires in 7 day
		httpOnly: true,
	});

	// generate access token
	const accessToken = user.generateAccessToken();
	res.status(200).json(
		new ApiResponse(200, { accessToken }, "Sign in successful")
	);
});

/*
==============================================
AUTH CONTROLLER - REFRESH
==============================================
 */
export const handleRefresh = asyncHandler(async (req, res) => {
	// console.log("\n:: handleRefresh => refresh_token: ", req.cookies);
	const cookies = req.cookies;
	if (!cookies?.refresh_token) {
		return res.status(401).json(new ApiError(401, "Unauthorized").toJSON());
	}

	jwt.verify(
		cookies.refresh_token,
		process.env.REFRESH_TOKEN_SECRET,
		async (error, decoded) => {
			if (error) {
				return res
					.status(403)
					.json(new ApiError(403, "Forbidden").toJSON());
			}

			const user = await User.findById(decoded._id);
			if (!user) {
				return res
					.status(401)
					.json(new ApiError(401, "Unauthorized").toJSON());
			}
			const accessToken = user.generateAccessToken();
			return res.status(200).json(new ApiResponse(200, { accessToken }));
		}
	);
});

/*
==============================================
AUTH CONTROLLER - SIGNOUT
==============================================
 */
export const handleSignout = asyncHandler(async (req, res) => {
	const user = req.user;

	// update user's refresh token to empty in database
	const updatedUser = await User.findByIdAndUpdate(user._id, {
		$set: { refreshToken: "" },
	});
	if (!updatedUser) {
		return res
			.status(500)
			.json(
				new ApiError(
					500,
					"Something went wrong while signing out"
				).toJSON()
			);
	}

	// clear refresh_token cookie
	res.clearCookie("refresh_token");
	return res
		.status(200)
		.json(new ApiResponse(200, null, "Sign out successful."));
});

/*
==============================================
AUTH CONTROLLER - CHANGE PASSWORD
==============================================
 */
export const handleChangePassword = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { oldPassword, newPassword } = req.body;

	const user = await User.findById(_id);
	if (!user) {
		return res
			.status(500)
			.json(new ApiError(500, "Can not update password.").toJSON());
	}
	// compare password
	const isPasswordMatched = await user.comparePassword(oldPassword);
	if (!isPasswordMatched) {
		return res
			.status(401)
			.json(
				new ApiError(
					401,
					"Your recent password did not match."
				).toJSON()
			);
	}

	user.password = newPassword;
	const response = await user.save();
	if (!response) {
		return res
			.status(500)
			.json(
				new ApiError(
					500,
					"Something went wrong while updating."
				).toJSON()
			);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, null, "Password updated."));
});

/*
==============================================
AUTH CONTROLLER - VERIFY EMAIL AND SEND OTP
==============================================
 */
export const handleVerifyEmail = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json(new ApiError(400, "Invalid credential."));
	}

	// generate OTP
	totp.label = user.fullname;
	const otp = totp.generate();

	// send otp into the email
	const mailOptions = {
		from: `blogg <${process.env.EMAIL_SEND_FROM}>`,
		to: user.email,
		subject: "OTP Verification",
		html: `<div>Your OTP is: <b>${otp}</b></div><div>This OTP will expire in 60 seconds.</div>`,
	};
	const sendMailResponse = await sendMail(mailOptions);

	// check sendMailResponse
	if (!sendMailResponse) {
		return res
			.status(500)
			.json(
				new ApiError(
					500,
					"Something went wrong while sending OTP."
				).toJSON()
			);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, { email: user.email }, "Email verified."));
});

/*
==============================================
AUTH CONTROLLER - VERIFY OTP
==============================================
 */
export const handleVeriryOTP = asyncHandler((req, res) => {
	const { otp } = req.body;

	// verify otp
	const delta = totp.validate({ token: otp, window: 1 });
	if (!delta) {
		return res
			.status(400)
			.json(new ApiError(400, "OTP is not valid.").toJSON());
	}

	return res.status(200).json(new ApiResponse(200, null, "OTP verified"));
});
