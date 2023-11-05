import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
	try {
		const dbConnection = await mongoose.connect(
			`${String(process.env.MONGODB_URI)}/${DB_NAME}`
		);
		console.log(
			`\n:: MongoDB connected.\n:: DB Host: ${dbConnection.connection.host}`
		);
	} catch (error) {
		console.error(`\n:: MongoDB connection ERROR :: ${error}`);
		process.exit(1);
	}
};

export default connectDB;
