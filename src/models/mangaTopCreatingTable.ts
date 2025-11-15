import pool from "../config/database.config";

export async function createTableTopManga(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE manga_top (
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

    CREATE INDEX idx_manga_top_mal_id ON manga_top(mal_id);
    CREATE INDEX idx_manga_top_score ON manga_top(score);
    CREATE INDEX idx_manga_top_type ON manga_top(type);
    CREATE INDEX idx_manga_top_data ON manga_top USING GIN (data);
  `
	);

	console.log("Successfully created 'manga_top' table");

	client.release();
}

createTableTopManga();
