import pool from '../../config/database.config';

export async function createTableAnimeTheme() {
	const client = await pool.connect();

	await client.query(
		`
    CREATE TABLE anime_theme (
        id SERIAL PRIMARY KEY,
        mal_id INTEGER UNIQUE NOT NULL REFERENCES anime(mal_id) ON DELETE CASCADE ON UPDATE CASCADE,
        themes JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_anime_theme_mal_id ON anime_theme(mal_id);
    `
	);

	console.log("Successfully created 'anime_theme' table");

	client.release();
}
