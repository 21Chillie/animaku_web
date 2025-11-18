import pool from "../../config/database.config";

export async function createTableAnime(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE anime (
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

    CREATE INDEX idx_anime_mal_id ON anime(mal_id);
    CREATE INDEX idx_anime_title ON anime(title);
    CREATE INDEX idx_anime_score ON anime(score);
    CREATE INDEX idx_anime_rank ON anime(rank);
    CREATE INDEX idx_anime_popularity ON anime(popularity);
    CREATE INDEX idx_anime_type ON anime(type);
    CREATE INDEX idx_anime_year ON anime(year);
    CREATE INDEX idx_anime_data ON anime USING GIN (data);
  `
	);

	console.log("Successfully created 'anime' table");

	client.release();
}
