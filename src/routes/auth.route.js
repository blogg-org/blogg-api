import {
	handleSignin,
	handleSignup,
	handleRefresh,
	handleSignout,
	handleVeriryOTP,
	handleVerifyEmail,
	handleResetPassword,
	handleChangePassword,
	handleGoogleAuth,
} from "../controllers/auth.controller.js";
import { Router } from "express";
import limiter from "../middlewares/limiter.middleware.js";
import checkAuth from "../middlewares/checkAuth.middleware.js";

/*
==============================================
AUTH ROUTER
==============================================
 */
const authRouter = Router();

authRouter.route("/signup").post(limiter, handleSignup);
authRouter.route("/signin").post(limiter, handleSignin);
authRouter.route("/refresh").get(handleRefresh);
authRouter.route("/signout").post(checkAuth, handleSignout);
authRouter.route("/change-password").put(checkAuth, handleChangePassword);
authRouter.route("/verify-email").post(limiter, handleVerifyEmail);
authRouter.route("/verify-otp").post(limiter, handleVeriryOTP);
authRouter.route("/reset-password").put(limiter, handleResetPassword);
authRouter.route("/google").post(limiter, handleGoogleAuth);

export default authRouter;
