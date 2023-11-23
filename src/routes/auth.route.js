import { Router } from "express";
import limiter from "../middlewares/limiter.middleware.js";
import {
	handleRefresh,
	handleSignin,
	handleSignout,
	handleSignup,
} from "../controllers/auth.controller.js";

/*
==============================================
AUTH ROUTER
==============================================
 */
const authRouter = Router();

authRouter.route("/signup").post(limiter, handleSignup);
authRouter.route("/signin").post(limiter, handleSignin);
authRouter.route("/refresh").get(handleRefresh);
authRouter.route("/signout").post(handleSignout);

export default authRouter;
