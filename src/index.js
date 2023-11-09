import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

/*
==============================================
LOAD .env FILE
==============================================
 */
dotenv.config({
	path: "./.env",
});

const PORT = process.env.PORT || 8000;

/*
==============================================
DATABASE CONNECTION AND APP SERVER START
==============================================
 */
connectDB()
	.then((dbConnection) => {
		console.log(
			`\n:: MongoDB connected.\n:: DB Host: ${dbConnection.connection.host}`
		);
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

		// server stop
		process.on("SIGINT", () => {
			dbConnection.connection.close().then(() => {
				console.log("\n:: MongoDB disconnected.");
				server.close(() => {
					console.log("\n:: Server disconnected.");
					process.exit(0);
				});
			});
		});
	})
	.catch((error) => {
		console.error("\n:: MongoDB connection failed.\n:: ERROR: ", error);
	});
