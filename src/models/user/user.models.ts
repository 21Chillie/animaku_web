import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { User } from '../../types/user.types';

export async function findUserById(id: string): Promise<User | null> {
	const result: QueryResult<User> = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

	return result.rows[0] ?? null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
	const result: QueryResult<User> = await pool.query('SELECT * FROM users WHERE email = $1', [
		email,
	]);

	return result.rows[0] ?? null;
}

export async function findUserByGoogleId(googleId: string): Promise<User | null> {
	const result: QueryResult<User> = await pool.query('SELECT * FROM users WHERE google_id = $1', [
		googleId,
	]);

	return result.rows[0] ?? null;
}

export async function findUserByUsername(username: string): Promise<User | null> {
	const result: QueryResult<User> = await pool.query('SELECT * FROM users WHERE username = $1', [
		username,
	]);

	return result.rows[0] ?? null;
}

export async function createLocalUser(
	email: string,
	password_hash: string,
	username: string
): Promise<User> {
	const result: QueryResult<User> = await pool.query(
		`
		INSERT INTO users (email, password_hash, username)
		VALUES ($1, $2, $3)
		RETURNING *
		`,
		[email, password_hash, username]
	);

	console.log(
		`User with username ${result.rows[0].username} is successfully inserting to database`
	);

	return result.rows[0];
}

export async function createGoogleUser(
	username: string,
	googleId: string,
	email: string | null,
	password_hash: string,
	avatarUrl: string | null
): Promise<User> {
	const result: QueryResult<User> = await pool.query(
		`
		INSERT INTO users (username, google_id, email, password_hash, avatar_url, is_email_verified) 
		VALUES ($1, $2, $3, $4, $5 true) 
		RETURNING *
		`,
		[username, googleId, email, password_hash ?? null, avatarUrl ?? null]
	);

	console.log(
		`User with username ${result.rows[0].username} is successfully inserting to database (GOOGLE)`
	);

	return result.rows[0];
}

export async function linkGoogleToUser(
	id: string,
	googleId: string,
	avatar_url?: string | null
): Promise<void> {
	const client = await pool.connect();

	try {
		await client.query(
			`
			UPDATE users 
			SET 
				google_id = $1, 
				avatar_url = $2, 
				is_email_verified = true,
				updated_at = CURRENT_TIMESTAMP
			WHERE id = $3
			`,
			[googleId, avatar_url ?? null, id]
		);

		console.log('Successfully link account with google');
	} catch (err) {
		console.log(err);
		throw new Error('Failed to link and update existing user with google account');
	} finally {
		client.release();
	}
}
