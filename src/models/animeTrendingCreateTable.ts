import pool from "../config/database.config";

export async function createTableTrendingAnime(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE anime_trending (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL,
    data JSONB NOT NULL,
    title VARCHAR(255) GENERATED ALWAYS AS (data->>'title') STORED,
    score DECIMAL(3,2) GENERATED ALWAYS AS ((data->>'score')::DECIMAL) STORED,
    type VARCHAR(50) GENERATED ALWAYS AS (data->>'type') STORED,
    status VARCHAR(50) GENERATED ALWAYS AS (data->>'status') STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_anime_trending_mal_id ON anime_trending(mal_id);
    CREATE INDEX idx_anime_trending_score ON anime_trending(score);
    CREATE INDEX idx_anime_trending_type ON anime_trending(type);
    CREATE INDEX idx_anime_trending_data ON anime_trending USING GIN (data);
  `
	);

	console.log("Successfully created 'anime_trending' table");

	client.release();
}

createTableTrendingAnime();
