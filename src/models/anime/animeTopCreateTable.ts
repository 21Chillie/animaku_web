import pool from "../../config/database.config";

export async function createTableTopAnime(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE anime_top (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL,
    title VARCHAR(255) GENERATED ALWAYS AS (data->>'title') STORED,
    type VARCHAR(50) GENERATED ALWAYS AS (data->>'type') STORED,
    status VARCHAR(50) GENERATED ALWAYS AS (data->>'status') STORED,
    year INTEGER GENERATED ALWAYS AS ((data->'aired'->'prop'->'from'->>'year')::INTEGER) STORED,
    score DECIMAL(3,2) GENERATED ALWAYS AS ((data->>'score')::DECIMAL) STORED,
    rank INTEGER GENERATED ALWAYS AS ((data->>'rank')::INTEGER) STORED,
    popularity INTEGER GENERATED ALWAYS AS ((data->>'popularity')::INTEGER) STORED,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_anime_top_mal_id ON anime_top(mal_id);
    CREATE INDEX idx_anime_top_title ON anime_top(title);
    CREATE INDEX idx_anime_top_score ON anime_top(score);
    CREATE INDEX idx_anime_top_rank ON anime_top(rank);
    CREATE INDEX idx_anime_top_popularity ON anime_top(popularity);
    CREATE INDEX idx_anime_top_type ON anime_top(type);
    CREATE INDEX idx_anime_top_year ON anime_top(year);
    CREATE INDEX idx_anime_top_data ON anime_top USING GIN (data);
  `
	);

	console.log("Successfully created 'anime_top' table");

	client.release();
}
