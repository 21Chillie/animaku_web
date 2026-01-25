import { DOMAIN_NAME, PORT } from "./env.config";

// Allowed origins
const allowedOrigins = [
	DOMAIN_NAME, // Cloudflare tunnel
	`http://localhost:${PORT}`, // Local dev
];

// CORS options
export const corsOptions = {
	origin: function (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void,
	) {
		// Allow requests with no origin (like mobile apps, curl, or server-to-server requests)
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true); // allowed
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true, // if you need cookies/auth
};
