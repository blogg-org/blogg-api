import rateLimit from "express-rate-limit";
import ApiResponse from "../utils/ApiResponse.js";

const limiter = rateLimit({
	windowMs: 60 * 1000,
	limit: 5,
	message: "Too many attempts. Please try again later.",
	standardHeaders: "draft-7",
	legacyHeaders: false,
	handler: (req, res, next, options) => {
		console.log(
			`\n:: Limiter => ${req.method} => ${req.url} => Message: ${options.message}`
		);
		res.status(options.statusCode).json(
			new ApiResponse(options.statusCode, null, options.message)
		);
	},
});

export default limiter;
