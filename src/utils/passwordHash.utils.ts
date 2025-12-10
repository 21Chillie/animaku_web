import bcrypt from 'bcryptjs';

export async function hashPassword(passwordPlain: string): Promise<string> {
	const salt = 10;
	const hash = await bcrypt.hash(passwordPlain, salt);

	console.log(hash);

	return hash;
}

export async function verifyPassword(
	passwordPlain: string,
	passwordHash: string
): Promise<boolean> {
	try {
		return await bcrypt.compare(passwordPlain, passwordHash);
	} catch {
		return false;
	}
}

export function validatePassword(passwordPlain: string): { valid: boolean; message: string } {
	if (passwordPlain.length < 8) {
		console.log('Password must be at least 8 characters long');

		return { valid: false, message: 'Password must be at least 8 characters long' };
	}

	const hasUpperCase = /[A-Z]/.test(passwordPlain);
	const hasLowerCase = /[a-z]/.test(passwordPlain);
	const hasNumbers = /\d/.test(passwordPlain);

	if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
		console.log('Password must contain at least one uppercase, lowercase letters and numbers');

		return {
			valid: false,
			message: 'Password must contain at least one uppercase, lowercase letters and numbers',
		};
	}

	console.log('Password is valid');

	return { valid: true, message: 'Password is valid' };
}
