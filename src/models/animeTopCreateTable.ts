import pool from "../config/database.config";

export async function createTableTopAnime(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE anime_top (
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

    CREATE INDEX idx_anime_top_mal_id ON anime_top(mal_id);
    CREATE INDEX idx_anime_top_score ON anime_top(score);
    CREATE INDEX idx_anime_top_type ON anime_top(type);
    CREATE INDEX idx_anime_top_data ON anime_top USING GIN (data);
  `
	);

	console.log("Successfully created 'anime_top' table");

	client.release();
}

createTableTopAnime();
