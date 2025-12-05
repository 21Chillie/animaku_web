import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseAnimeTypes } from '../../types/database.types';

export async function getOldAnimeTrending(daysThreshold: number): Promise<DatabaseAnimeTypes[]> {
	const result: QueryResult<DatabaseAnimeTypes> = await pool.query(
		`SELECT * FROM anime_trending WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
		[daysThreshold]
	);

	return result.rows;
}

export async function deleteOldAnimeTrending(daysThreshold: number): Promise<number> {
	const result = await pool.query(
		`DELETE FROM anime_trending WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
		[daysThreshold]
	);

	return result.rowCount ?? 0;
}

export async function getAllAnimeTrending(): Promise<DatabaseAnimeTypes[]> {
	const result: QueryResult<DatabaseAnimeTypes> = await pool.query(
		`SELECT * FROM anime_trending ORDER BY (data->>'popularity'):: INTEGER ASC`
	);

	return result.rows;
}

export async function getAnimeTrendingLimit(maxRecords: number): Promise<DatabaseAnimeTypes[]> {
	const result = await pool.query(
		`SELECT * FROM anime_trending ORDER BY (data->>'popularity'):: INTEGER ASC LIMIT $1`,
		[maxRecords]
	);

	return result.rows;
}

export async function getAnimeTrendingCount(): Promise<number> {
	const result = await pool.query(`SELECT COUNT(*) FROM anime_trending`);
	return parseInt(result.rows[0].count);
}

export async function getAnimeTrendingPaginated(
	limit: number,
	offset: number
): Promise<DatabaseAnimeTypes[]> {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`
			SELECT * FROM anime_trending
      ORDER BY popularity ASC NULLS LAST 
      LIMIT $1 OFFSET $2`,
			[limit, offset]
		);
		return result.rows;
	} finally {
		client.release();
	}
}
