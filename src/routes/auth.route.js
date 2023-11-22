import { Router } from "express";
import limiter from "../middlewares/limiter.middleware.js";
import { handleSignin, handleSignup } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/signup").post(limiter, handleSignup);
authRouter.route("/signin").post(limiter, handleSignin);

export default authRouter;
