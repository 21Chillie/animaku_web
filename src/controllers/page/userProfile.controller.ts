import type { Request, Response } from 'express';
import {
	changePassword,
	changeUsername,
	getById,
	getByUsername,
} from '../../services/user.service';
import { validatePassword, verifyPassword } from '../../utils/passwordHash.utils';
import { EditProfileRequestBody } from '../../types/user.types';

export async function renderUserProfile(req: Request, res: Response) {
	const user = req.user?.id;

	if (!user) {
		return res.render('error', {
			success: false,
			status_code: 403,
			error: 'Forbidden',
			message: 'You need to login/signup to access this page or content',
			path: null,
		});
	}

	const userData = await getById(user);

	if (!userData) {
		return res.render('error', {
			success: false,
			status_code: 404,
			error: 'Not Found',
			message: `User data with id ${user} not found`,
			path: null,
		});
	}

	const date = new Date(userData.created_at);
	const formattedDate = date.toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric',
	});

	res.render('userProfile', {
		avatar: userData.avatar_url,
		username: userData.username,
		email: userData.email,
		accountAge: formattedDate,
		success: null,
		message: null,
	});
}

export async function userProfileUpdated(
	req: Request<{}, {}, EditProfileRequestBody>,
	res: Response
) {
	const { username, oldPassword, newPassword } = req.body;
	const user = req.user;

	if (!user) {
		return res.render('error', {
			success: false,
			status_code: 403,
			error: 'Forbidden',
			message: 'You need to login/signup to access this page or content',
			path: null,
		});
	}

	const userData = await getById(user.id);

	if (!userData) {
		return res.render('error', {
			success: false,
			status_code: 404,
			error: 'Not Found',
			message: `User data with id ${user} not found`,
		});
	}

	const date = new Date(userData.created_at);
	const formattedDate = date.toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric',
	});

	if (username && username !== user?.username) {
		const checkNewUsername = await getByUsername(username);

		if (checkNewUsername) {
			return res.status(400).render('userProfile', {
				avatar: userData.avatar_url,
				username: userData.username,
				email: userData.email,
				accountAge: formattedDate,
				message: 'Username is already exists',
			});
		}

		await changeUsername(user?.id, username);
	}

	if (newPassword) {
		if (!oldPassword)
			return res.status(400).render('userProfile', {
				avatar: userData.avatar_url,
				username: userData.username,
				email: userData.email,
				accountAge: formattedDate,
				message: 'Old password is required to change password',
			});
	}

	const passwordHash = userData.password_hash;
	const passwordValid = validatePassword(newPassword);

	if (passwordValid.valid === false) {
		return res.status(400).render('userProfile', {
			avatar: userData.avatar_url,
			username: userData.username,
			email: userData.email,
			accountAge: formattedDate,
			message: passwordValid.message,
		});
	}

	const oldPasswordMatch = await verifyPassword(oldPassword, passwordHash);

	if (!oldPasswordMatch) {
		return res.status(400).render('userProfile', {
			avatar: userData.avatar_url,
			username: userData.username,
			email: userData.email,
			accountAge: formattedDate,
			message: 'Old password are incorrect',
		});
	}

	await changePassword(user.id, newPassword);

	res.redirect('/profile');
}
