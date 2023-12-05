import transporter from "../config/nodemailer.config.js";

export const sendMail = async (mailOptions) => {
	try {
		const response = await transporter.sendMail(mailOptions);
		return response;
	} catch (error) {
		throw error;
	}
};
