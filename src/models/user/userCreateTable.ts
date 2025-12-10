import pool from '../../config/database.config';

export async function createUserTable() {
	const client = await pool.connect();

	try {
		await client.query(
			`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      
      CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE,
      password_hash TEXT,
      google_id TEXT UNIQUE,
      username VARCHAR(50) UNIQUE NOT NULL,
      avatar_url TEXT DEFAULT '/images/portrait-placeholder.webp',
      is_email_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX users_email_idx ON users (email);
      CREATE INDEX users_username_idx ON users (username);
      CREATE INDEX users_google_id_idx ON users(google_id);
      `
		);

		console.log("Success creating 'user' table");
	} catch (err) {
		console.log("Error while create 'user' table");
	} finally {
		client.release();
	}
}
