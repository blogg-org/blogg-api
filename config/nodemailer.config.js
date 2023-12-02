import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465, // 465 if secure is true
	secure: true,
	auth: {
		user: process.env.EMAIL_TRANSPORTER_AUTH_USER,
		pass: process.env.EMAIL_TRANSPORTER_AUTH_PASS,
	},
});

export default transporter;
