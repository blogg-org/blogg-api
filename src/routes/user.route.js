import express from "express";
import {
	handleGetAllUsers,
	handleGetUserById,
} from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter.route("/all-users").get(handleGetAllUsers);
userRouter.route("/:userId").get(handleGetUserById);

export default userRouter;
