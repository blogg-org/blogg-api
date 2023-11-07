import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { corsOrigins } from "./utils/corsOrigins.js";

// app instance
const app = express();

/*****************
 *
 * MIDDLEWARES
 *
 *****************/

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
	})
);

// static middleware
app.use(express.static("public"));

// cookie parser middleware
app.use(cookieParser());

/*****************
 *
 * ROOT ROUTE
 *
 *****************/
app.get("/", (req, res) => {
	res.json({
		app: "blogg-api",
	});
});

export default app;
