import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const {
	PORT,
	NODE_ENV,
	SESSION_SECRET,
	DB_HOST,
	DB_PORT,
	DB_NAME,
	DB_USER,
	DB_PASSWORD,
	JIKAN_BASE_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CALLBACK_URL,
} = process.env;
