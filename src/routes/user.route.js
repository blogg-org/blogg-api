import express from "express";
import {
	handleGetAllUsers,
	handleGetCurrentUser,
} from "../controllers/user.controller.js";
import checkAuth from "../middlewares/checkAuth.middleware.js";

/*
==============================================
USER ROUTER
==============================================
 */
const userRouter = express.Router();

userRouter.route("/all-users").get(handleGetAllUsers);
userRouter.route("/current-user").get(checkAuth, handleGetCurrentUser);

export default userRouter;
