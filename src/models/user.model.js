import mongoose from "mongoose";
import pkg from "bcryptjs";
const { genSalt, hash, compare } = pkg;

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
	},
	{ timestamps: true }
);

// hash password before user is saved to database
userSchema.pre("save", async function (next) {
	const user = this;
	try {
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

export const User = mongoose.model("User", userSchema);
