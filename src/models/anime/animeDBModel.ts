import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseAnimeTypes } from '../../types/database.types';

export async function getAnimeByMalId(mal_id: number): Promise<DatabaseAnimeTypes[]> {
	const result: QueryResult<DatabaseAnimeTypes> = await pool.query(
		`SELECT * FROM anime WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows;
}
