import pool from '../../config/database.config';

export async function createTableAnimeRecommendation(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE anime_recommendation (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL REFERENCES anime(mal_id),
    recommendation_data JSONB[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_anime_recommendation_mal_id ON anime_recommendation(mal_id);
  `
	);

	console.log("Successfully created 'anime_recommendation' table");

	client.release();
}

export async function createTableMangaRecommendation(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE manga_recommendation (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL REFERENCES manga(mal_id),
    recommendation_data JSONB[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_manga_recommendation_mal_id ON manga_recommendation(mal_id);
  `
	);

	console.log("Successfully created 'manga_recommendation' table");

	client.release();
}
