import { OAuth2Client } from "google-auth-library";

export const oAuth2Client = new OAuth2Client({
	clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
	clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	redirectUri: "postmessage",
});
