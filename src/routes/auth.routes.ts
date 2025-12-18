import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import passport from 'passport';
import {
	getGoogleComplete,
	getLogin,
	getRegister,
	postGoogleComplete,
	postRegister,
} from '../controllers/page/auth.controller';

import { User } from '../types/user.types';

export const authRoute = express.Router();

// Get Login Route
authRoute.get('/login', getLogin);

// Post Login Route
authRoute.post('/login', (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		'local',
		async (err: unknown, user: Express.User | false, info?: { message?: string }) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				return res.status(401).render('login', {
					error: info?.message ?? 'Invalid credentials',
				});
			}

			req.logIn(user, (loginErr) => {
				if (loginErr) {
					return next(loginErr);
				}

				return res.redirect('/');
			});
		}
	)(req, res, next);
});

// Sign Up Route
authRoute.get('/register', getRegister);
authRoute.post('/register', postRegister);

// Logout Route
authRoute.get('/logout', (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		req.session.destroy(() => {
			res.clearCookie('connect.sid');
			res.redirect('/');
		});
	});
});

// Google Auth Route
authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoute.get('/google/callback', (req, res, next) => {
	passport.authenticate('google', (err: unknown, user: User, info?: unknown) => {
		if (err) {
			console.error(err);
			return next(err);
		}

		if (user) {
			req.login(user, (loginErr) => {
				if (loginErr) return next(loginErr);
				res.redirect('/');
			});
		} else {
			// no user created yet -> must complete sign up
			return res.redirect('/auth/google/complete-setup');
		}
	})(req, res, next);
});

authRoute.get('/google/complete-setup', getGoogleComplete);
authRoute.post('/google/complete-setup', postGoogleComplete);
