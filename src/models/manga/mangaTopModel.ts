import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseMangaTypes } from '../../types/database.types';

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

export async function getMangaTopCount(): Promise<number> {
	const result = await pool.query(`SELECT COUNT(*) FROM manga_top`);
	return parseInt(result.rows[0].count);
}

export async function getMangaTopPaginated(
	limit: number,
	offset: number
): Promise<DatabaseMangaTypes[]> {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`
			SELECT * FROM manga_top
      ORDER BY rank ASC NULLS LAST
      LIMIT $1 OFFSET $2`,
			[limit, offset]
		);
		return result.rows;
	} finally {
		client.release();
	}
}
