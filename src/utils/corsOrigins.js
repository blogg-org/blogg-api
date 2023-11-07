export const corsOrigins = process.env.CORS_ORIGINS.split(",").map((item) =>
	item.trim()
);
