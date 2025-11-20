import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseRelationResponse, Relation } from '../../types/relationData.types';

export async function insertAnimeRelationByMalId(mal_id: number, data: Relation[]) {
	try {
		await pool.query(
			`
			INSERT INTO anime_relation(mal_id, relation_data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		relation_data = EXCLUDED.relation_data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting anime relation data into database: ', err);
	}
}

export async function getAnimeRelationByMalId(mal_id: number): Promise<DatabaseRelationResponse> {
	const result: QueryResult<DatabaseRelationResponse> = await pool.query(
		`SELECT relation_data FROM anime_relation WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0];
}

export async function insertMangaRelationByMalId(mal_id: number, data: Relation[]) {
	try {
		await pool.query(
			`
			INSERT INTO manga_relation(mal_id, relation_data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		relation_data = EXCLUDED.relation_data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting manga relation data into database: ', err);
	}
}

export async function getMangaRelationByMalId(mal_id: number): Promise<DatabaseRelationResponse> {
	const result: QueryResult<DatabaseRelationResponse> = await pool.query(
		`SELECT relation_data FROM manga_relation WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0];
}
