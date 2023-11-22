import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

/*
==============================================
APP INSTANCE
==============================================
 */
const app = express();

/*
==============================================
MIDDLEWARES - PLUGINS
==============================================
 */

//CORS: Cross-Origin Resource Sharing middleware
app.use(
	cors({
		origin: String(process.env.CORS_ORIGINS),
		optionsSuccessStatus: 200,
		credentials: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	})
);

// json middleware
app.use(
	express.json({
		type: "application/json",
		limit: "32kb",
	})
);

// urlencoded middleware
app.use(
	express.urlencoded({
		limit: "32kb",
		extended: false,
	})
);

// static middleware
app.use(express.static("public"));

// cookie parser middleware
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

/*
==============================================
ROOT ROUTE
==============================================
 */
app.get("/", (req, res) => {
	res.json({
		app: "blogg-api",
	});
});

export default app;
