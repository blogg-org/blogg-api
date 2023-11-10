import express from "express";
import {
	handleSignup,
	handleGetAllUsers,
	handleGetUserById,
	handleSignin,
} from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter.get("/", handleGetAllUsers);
userRouter.post("/signup", handleSignup);
userRouter.post("/signin", handleSignin);
userRouter.route("/:userId").get(handleGetUserById);

export default userRouter;
