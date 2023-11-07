import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

// load env variables
dotenv.config({
	path: "./.env",
});

const PORT = process.env.PORT || 8000;

// database connection
connectDB()
	.then(() => {
		// app server
		const server = app.listen(PORT, () => {
			console.log(
				`\n:: application is running at http://localhost:${PORT}`
			);
		});

		// on server error
		server.on("error", (error) => {
			console.error("\n:: Server error: ", error);
		});

		// // server stop
		process.on("SIGINT", () => {
			server.close(() => {
				console.log("\n:: Server closed.");
				process.exit(0);
			});
		});
	})
	.catch((error) => {
		console.error("\n:: MongoDB connection failed.\n:: ERROR: ", error);
	});
