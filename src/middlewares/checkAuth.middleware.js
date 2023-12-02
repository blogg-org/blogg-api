import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkAuth = asyncHandler((req, res, next) => {
	const token =
		req.headers?.authorization &&
		req.headers.authorization.split("Bearer ")[1];

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
		req.user = decoded;
		next();
	});
});

export default checkAuth;
