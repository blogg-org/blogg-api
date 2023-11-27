import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const checkAuth = asyncHandler((req, res, next) => {
	const token =
		req.headers?.authorization &&
		req.headers.authorization.split("Bearer ")[1];
	// console.log("\n:: checkAuth middleware => token: ", token);

	if (!token) {
		return res.status(401).json(new ApiError(401, "Unauthorized").toJSON());
	}

	// verify token
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
		if (error) {
			return res
				.status(403)
				.json(new ApiError(403, "Forbidden").toJSON());
		}
		// console.log("\n:: checkAuth middleware => decoded: ", decoded);
		req.user = decoded;
		next();
	});
});

export default checkAuth;
