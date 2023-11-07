import express from "express";

// app instance
const app = express();

// root route
app.get("/", (req, res) => {
	res.json({
		app: "blogg-api",
	});
});

export default app;
