import type { NextFunction, Request, Response } from 'express';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.isAuthenticated && req.isAuthenticated()) {
		return next();
	}

	res.redirect('/auth/login');
}
