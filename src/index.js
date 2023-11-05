import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";

// load env variables
dotenv.config({
	path: "./.env",
});

// app instance
const app = express();

const PORT = process.env.PORT || 8000;

// database connection
connectDB().then(() => {
	// app server
	const server = app.listen(PORT, () => {
		console.log(`:: application is running at http://localhost:${PORT}`);
	});
});

// root route
app.get("/", (req, res) => {
	res.json({
		app: "blogg-api",
	});
});
