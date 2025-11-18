import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseAnimeTypes } from '../../types/database.types';

export async function getOldAnimeTop(daysThreshold: number): Promise<DatabaseAnimeTypes[]> {
	const result: QueryResult<DatabaseAnimeTypes> = await pool.query(
		`SELECT * FROM anime_top WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
		[daysThreshold]
	);

	return result.rows;
}

export async function deleteOldAnimeTop(daysThreshold: number): Promise<number> {
	const result = await pool.query(
		`DELETE FROM anime_top WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
		[daysThreshold]
	);

	return result.rowCount ?? 0;
}

export async function getAllAnimeTop(): Promise<DatabaseAnimeTypes[]> {
	const result: QueryResult<DatabaseAnimeTypes> = await pool.query(
		`SELECT * FROM anime_top t ORDER BY t.score DESC`
	);

	return result.rows;
}

export async function getAnimeTopLimit(maxRecords: number): Promise<DatabaseAnimeTypes[]> {
	const result = await pool.query(`SELECT * FROM anime_top t ORDER BY t.score DESC LIMIT $1`, [
		maxRecords,
	]);

	return result.rows;
}
