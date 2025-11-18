import pool from "../../config/database.config";

export async function createTableTopManga(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE manga_top (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL,
    title VARCHAR(255) GENERATED ALWAYS AS (data->>'title') STORED,
    type VARCHAR(50) GENERATED ALWAYS AS (data->>'type') STORED,
    status VARCHAR(50) GENERATED ALWAYS AS (data->>'status') STORED,
    year INTEGER GENERATED ALWAYS AS ((data->'published'->'prop'->'from'->>'year')::INTEGER) STORED,
    score DECIMAL(3,2) GENERATED ALWAYS AS ((data->>'score')::DECIMAL) STORED,
    rank INTEGER GENERATED ALWAYS AS ((data->>'rank')::INTEGER) STORED,
    popularity INTEGER GENERATED ALWAYS AS ((data->>'popularity')::INTEGER) STORED,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE INDEX idx_manga_top_mal_id ON manga_top(mal_id);
    CREATE INDEX idx_manga_top_title ON manga_top(title);
    CREATE INDEX idx_manga_top_score ON manga_top(score);
    CREATE INDEX idx_manga_top_rank ON manga_top(rank);
    CREATE INDEX idx_manga_top_popularity ON manga_top(popularity);
    CREATE INDEX idx_manga_top_type ON manga_top(type);
    CREATE INDEX idx_manga_top_year ON manga_top(year);
    CREATE INDEX idx_manga_top_data ON manga_top USING GIN (data);
  `
	);

	console.log("Successfully created 'manga_top' table");

	client.release();
}
