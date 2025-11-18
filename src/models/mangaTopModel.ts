import { QueryResult } from 'pg';
import pool from '../config/database.config';
import { DatabaseMangaTypes } from '../types/database.types';

export async function getOldMangaTop(daysThreshold: number): Promise<DatabaseMangaTypes[]> {
	const result: QueryResult<DatabaseMangaTypes> = await pool.query(
		`SELECT * FROM manga_top WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
		[daysThreshold]
	);

	return result.rows;
}

export async function deleteOldMangaTop(daysThreshold: number): Promise<number> {
	const result = await pool.query(
		`DELETE FROM manga_top WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
		[daysThreshold]
	);

	return result.rowCount ?? 0;
}

export async function getAllMangaTop(): Promise<DatabaseMangaTypes[]> {
	const result: QueryResult<DatabaseMangaTypes> = await pool.query(
		`SELECT * FROM manga_top ORDER BY score DESC`
	);

	return result.rows;
}

export async function getMangaTopLimit(maxRecords: number): Promise<DatabaseMangaTypes[]> {
	const result = await pool.query(`SELECT * FROM manga_top t ORDER BY t.score DESC LIMIT $1`, [
		maxRecords,
	]);

	return result.rows;
}
