import type { Request, Response } from 'express';

export async function renderLogin(req: Request, res: Response) {
	res.render('login');
}

export async function postLogin(req: Request, res: Response) {
	const { username, password } = req.body;

	console.log('Login Success!');
	console.log(`username: ${username}, password: ${password}`);

	res.redirect('/');
}

export async function renderRegister(req: Request, res: Response) {
	res.render('signup');
}

export async function postRegister(req: Request, res: Response) {
	const { email, username, password } = req.body;

	console.log('Register Success!');
	console.log(`email: ${email}, username: ${username}, password: ${password}`);

	res.redirect('/');
}

