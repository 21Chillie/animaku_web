import type { Request } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config/env.config';
import {
	attachGoogle,
	getByEmail,
	getByGoogleId,
	getById,
	getByUsername,
} from '../services/user.service';
import type { User } from '../types/user.types';
import { verifyPassword } from '../utils/passwordHash.utils';

passport.use(
	// Get username and password field from input field in login page
	new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async function (
		username: string,
		password: string,
		done
	) {
		try {
			// Check if input username exist
			const user: User | null = await getByUsername(username);

			if (!user || !user.password_hash) {
				return done(null, false, { message: 'Invalid credentials' });
			}

			// If username exist, verify the password
			const isPasswordValid = await verifyPassword(password, user.password_hash);

			if (!isPasswordValid) {
				return done(null, false, { message: 'Invalid credentials' });
			}

			// Debug
			console.log('Local strategy authentication succeeded');

			// User authenticed
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

if (!GOOGLE_CLIENT_ID || !GOOGLE_CALLBACK_URL || !GOOGLE_CLIENT_SECRET) {
	throw new Error('Missing Google OAuth environment variables');
}

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: GOOGLE_CALLBACK_URL,
			passReqToCallback: true,
		},
		async function (
			req: Request,
			accessToken: string,
			refreshToken: string,
			profile: Profile,
			done: (err: Error | null, user?: User | false) => void
		) {
			try {
				// Debug
				console.log('Raw Google Profile:', profile);

				// Store google id, email, avatar
				const googleId = profile.id;
				const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
				const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

				// Check if user with google id is existing
				const userAccountGoogle = await getByGoogleId(googleId);
				if (userAccountGoogle) {
					return done(null, userAccountGoogle);
				}

				// If existing user with same email, then link google account to existing user account
				if (email) {
					const existingEmail = await getByEmail(email);
					if (existingEmail) {
						// Update account with linked google, by update google id and avatar
						await attachGoogle(existingEmail.id, googleId, avatar);

						// Get updated user account with id, if account exist then user is authenticated
						const updatedAccount = await getById(existingEmail.id);
						if (updatedAccount) {
							return done(null, updatedAccount);
						}
					}
				}

				// if it's no account exist with google id or email, then store minimal oauth profile in session for completing form
				req.session.oauthProfile = {
					provider: 'google',
					id: googleId,
					email,
					avatarUrl: avatar,
				};

				// No user authenticated
				return done(null, false);
			} catch (err) {
				return done(err as Error);
			}
		}
	)
);

// Store user id in the session
passport.serializeUser((user: Express.User, done) => {
	// Debug
	console.log('serializeUser: storing user.id in session:', user.id);
	done(null, user.id);
});

passport.deserializeUser(async function (id: string, done) {
	try {
		console.log('deserializeUser: loading user from DB by ID:', id);
		const user = await getById(id);
		console.log('deserializeUser: loaded user:', user);

		return done(null, user ?? false);
	} catch (err) {
		done(err as Error);
	}
});

export default passport;
