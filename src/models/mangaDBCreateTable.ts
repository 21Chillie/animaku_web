import pool from '../config/database.config';

export async function createTableManga(): Promise<void> {
	const client = await pool.connect();

	await client.query(
		`
  CREATE TABLE manga (
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

    CREATE INDEX idx_manga_mal_id ON manga(mal_id);
    CREATE INDEX idx_manga_title ON manga(title);
    CREATE INDEX idx_manga_score ON manga(score);
    CREATE INDEX idx_manga_rank ON manga(rank);
    CREATE INDEX idx_manga_popularity ON manga(popularity);
    CREATE INDEX idx_manga_type ON manga(type);
    CREATE INDEX idx_manga_year ON manga(year);
    CREATE INDEX idx_manga_data ON manga USING GIN (data);
  `
	);

	console.log("Successfully created 'manga' table");

	client.release();
}
