import { RequestHandler } from "express";

// Basic security headers without the complexity of helmet
export const basicSecurityHeaders: RequestHandler = (req, res, next) => {
	// Prevent MIME type sniffing
	res.setHeader("X-Content-Type-Options", "nosniff");

	// Basic XSS protection
	res.setHeader("X-XSS-Protection", "1; mode=block");

	// Prevent clickjacking
	res.setHeader("X-Frame-Options", "SAMEORIGIN");

	next();
};
