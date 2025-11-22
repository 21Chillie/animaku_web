import type { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseMangaTypes } from '../../types/database.types';
import { Manga } from '../../types/mangaData.types';

export async function insertMangaDataByMalId(data: Manga) {
	try {
		await pool.query(
			`
			INSERT INTO manga(mal_id, data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		data = EXCLUDED.data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[data.mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting manga data into database: ', err);
	}
}

export async function getMangaByMalId(mal_id: number): Promise<DatabaseMangaTypes> {
	const result: QueryResult<DatabaseMangaTypes> = await pool.query(
		`SELECT * FROM manga WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0];
}

export async function getAllManga(): Promise<DatabaseMangaTypes[]> {
	const result: QueryResult<DatabaseMangaTypes> = await pool.query(`SELECT * FROM manga`);

	return result.rows;
}
