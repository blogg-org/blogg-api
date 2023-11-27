import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.middleware.js";
import {
	handleAddNewBlog,
	handleGetAllBlogs,
	handleRemoveBlog,
	handleUpdateBlog,
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const blogRouter = Router();

blogRouter.route("/").get(checkAuth, handleGetAllBlogs);

blogRouter
	.route("/add")
	.post(checkAuth, upload.single("featuredImage"), handleAddNewBlog);

blogRouter.route("/remove/:blogId").delete(checkAuth, handleRemoveBlog);

blogRouter
	.route("/edit/:blogId")
	.put(checkAuth, upload.single("featuredImage"), handleUpdateBlog);

export default blogRouter;
