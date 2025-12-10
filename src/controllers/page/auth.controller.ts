import type { Request, Response } from 'express';

import {
	getByEmail,
	getByUsername,
	registerGoogle,
	registerLocal,
} from '../../services/user.service';
import { hashPassword, validatePassword } from '../../utils/passwordHash.utils';

export async function getLogin(req: Request, res: Response): Promise<void> {
	res.render('login', { user: req.user ?? null, error: null });
}

export async function getRegister(req: Request, res: Response): Promise<void> {
	res.render('signup', {
		success: null,
		message: null,
	});
}

export async function postRegister(req: Request, res: Response): Promise<void> {
	const { email, username, password } = req.body as {
		username?: string;
		email?: string;
		password?: string;
	};

	if (!email || !username || !password) {
		return res.status(400).render('signup', {
			success: false,
			message: 'username, email, and password are required',
		});
	}

	const userExist = await getByUsername(username);
	if (userExist) {
		return res.status(400).render('signup', {
			success: false,
			message: 'Username or email already taken',
		});
	}

	const emailExist = await getByEmail(email);
	if (emailExist) {
		return res.status(400).render('signup', {
			success: false,
			message: 'Username or email already taken',
		});
	}

	const passwordValidate = validatePassword(password);

	if (passwordValidate.valid === false) {
		return res.status(400).render('signup', {
			success: false,
			message: passwordValidate.message,
		});
	}

	const passwordHash = await hashPassword(password);
	const registerUser = await registerLocal(email, passwordHash, username);

	req.login(registerUser, (err) => {
		if (err) {
			console.error(err);
			return res.redirect('/auth/login');
		}

		res.redirect('/')
	});
}

export async function getGoogleComplete(req: Request, res: Response): Promise<void> {
	const oauth = req.session.oauthProfile;

	console.log(oauth);

	if (!oauth || oauth.provider !== 'google') {
		return res.redirect('/auth/login');
	}

	res.render('signUpGoogleComplete', {
		email: oauth.email ?? '',
		success: null,
		message: null,
	});
}

export async function postGoogleComplete(req: Request, res: Response): Promise<void> {
	const oauth = req.session.oauthProfile;
	console.log(oauth)
	const { username, password } = req.body as { username?: string; password?: string };

	if (!oauth || oauth.provider !== 'google') {
		return res.redirect('/auth/login');
	}

	if (!username || !password) {
		return res.status(400).render('signUpGoogleComplete', {
			email: oauth.email ?? '',
			success: false,
			message: 'Username and password required',
		});
	}

	const existingUser = await getByUsername(username);
	if (existingUser) {
		return res.status(400).render('signUpGoogleComplete', {
			email: oauth.email ?? '',
			success: false,
			message: 'Username are already taken',
		});
	}

	if (oauth.email && (await getByEmail(oauth.email))) {
		return res.status(400).render('signUpGoogleComplete', {
			email: oauth.email ?? '',
			success: false,
			message: 'Username are already taken',
		});
	}

	const passwordValidate = validatePassword(password);
	if (passwordValidate.valid === false) {
		return res.status(400).render('signUpGoogleComplete', {
			success: false,
			message: passwordValidate.message,
		});
	}

	const passwordHash = await hashPassword(password);
	const registerUser = await registerGoogle(
		username,
		oauth.id,
		oauth.email ?? null,
		passwordHash,
		oauth.avatarUrl ?? null
	);

	req.login(registerUser, (err) => {
		if (err) {
			console.error(err);
			res.redirect('/auth/login');
			return;
		}
		res.redirect('/')
	});
}
