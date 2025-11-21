import pool from '../../config/database.config';

export async function createTableAnimeCharacter(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE anime_character (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL REFERENCES anime(mal_id) ON DELETE CASCADE ON UPDATE CASCADE,
    character_data JSONB[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_anime_character_mal_id ON anime_character(mal_id);
  `
	);

	console.log("Successfully created 'anime_character' table");

	client.release();
}

export async function createTableMangaCharacter(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE manga_character (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL REFERENCES manga(mal_id) ON DELETE CASCADE ON UPDATE CASCADE,
    character_data JSONB[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_manga_character_mal_id ON manga_character(mal_id);
  `
	);

	console.log("Successfully created 'manga_character' table");

	client.release();
}
