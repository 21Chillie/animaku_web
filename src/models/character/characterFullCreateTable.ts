import pool from '../../config/database.config';

export async function createTableCharacterFull(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE character_full (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(255) GENERATED ALWAYS AS (data->>'name') STORED,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_character_full_mal_id ON character_full(mal_id);
  `
	);

	console.log("Successfully created 'character_full' table");

	client.release();
}
