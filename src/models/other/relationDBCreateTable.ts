import pool from '../../config/database.config';

export async function createTableAnimeRelation(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE anime_relation (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL REFERENCES anime(mal_id),
    relation_data JSONB[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_anime_relation_mal_id ON anime_relation(mal_id);
    CREATE INDEX idx_anime_relation_data ON anime_relation USING GIN (relation_data);
  `
	);

	console.log("Successfully created 'anime_relation' table");

	client.release();
}

export async function createTableMangaRelation(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE manga_relation (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL REFERENCES manga(mal_id),
    relation_data JSONB[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_manga_relation_mal_id ON manga_relation(mal_id);
    CREATE INDEX idx_manga_relation_data ON manga_relation USING GIN (relation_data);
  `
	);

	console.log("Successfully created 'manga_relation' table");

	client.release();
}
