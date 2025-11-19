import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { Anime } from '../../types/animeData.types';
import { DatabaseAnimeTypes } from '../../types/database.types';

export async function insertAnimeDataByMalId(data: Anime) {
	try {
		await pool.query(
			`
			INSERT INTO anime(mal_id, data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		data = EXCLUDED.data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[data.mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting anime data into database: ', err);
	}
}

export async function getAnimeByMalId(mal_id: number): Promise<DatabaseAnimeTypes> {
	const result: QueryResult<DatabaseAnimeTypes> = await pool.query(
		`SELECT * FROM anime WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0];
}
