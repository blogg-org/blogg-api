import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { corsOrigins } from "./utils/corsOrigins.js";
import userRouter from "./routes/user.route.js";

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
		origin: corsOrigins,
		optionsSuccessStatus: 200,
		credentials: true,
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

app.use("/api/users", userRouter);

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
