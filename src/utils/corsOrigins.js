export const corsOrigins = String(process.env.CORS_ORIGINS)
	.split(",")
	.map((item) => item.trim());
