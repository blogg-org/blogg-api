import mongoose from "mongoose";
import pkg from "bcryptjs";
import jwt from "jsonwebtoken";
const { genSalt, hash, compare } = pkg;

/*
==============================================
USER SCHEMA
==============================================
 */
const userSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			required: true,
			trim: true,
			maxLength: 50,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: String,
		},
	},
	{ timestamps: true }
);

/*
==============================================
USER SCHEMA MIDDLEWARES - PLUGINS
==============================================
 */

// hash password before user is saved to database
userSchema.pre("save", async function (next) {
	try {
		const user = this;
		if (!user.isModified("password")) return next();
		const salt = await genSalt(10);
		const hashedPassword = await hash(user.password, salt);
		user.password = hashedPassword;
		next();
	} catch (error) {
		next(error);
	}
});

// compare password for signin
userSchema.method("comparePassword", async function comparePassword(password) {
	const user = this;
	const isMatched = await compare(password, user.password);
	return isMatched;
});

// generate access token
userSchema.method("generateAccessToken", function generateAccessToken() {
	return jwt.sign(
		{
			_id: this._id,
			fullname: this.fullname,
			email: this.email,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "30s",
		}
	);
});

// generate refresh token
userSchema.method("generateRefreshToken", function generateRefreshToken() {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "30s",
		}
	);
});

/*
==============================================
USER MODEL
==============================================
 */
export const User = mongoose.model("User", userSchema);
