import * as OTPAuth from "otpauth";

// Create a new TOTP object.
const totp = new OTPAuth.TOTP({
	issuer: process.env.TOTP_ISSUER,
	algorithm: "SHA1",
	digits: 4,
	period: 60,
	secret: process.env.TOTP_SECRET,
});

export default totp;
