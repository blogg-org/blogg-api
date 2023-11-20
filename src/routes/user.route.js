import express from "express";
import {
	handleSignup,
	handleGetAllUsers,
	handleGetUserById,
	handleSignin,
} from "../controllers/user.controller.js";
import limiter from "../middlewares/limiter.middleware.js";

const userRouter = express.Router();
userRouter.route("/").get(handleGetAllUsers);
userRouter.route("/signup").post(limiter, handleSignup);
userRouter.route("/signin").post(limiter, handleSignin);
userRouter.route("/:userId").get(handleGetUserById);

export default userRouter;
