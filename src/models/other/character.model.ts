import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseCharacterResponse, JikanCharacter } from '../../types/characterData.types';

export async function insertAnimeCharacterByMalId(mal_id: number, data: JikanCharacter[]) {
	try {
		await pool.query(
			`
			INSERT INTO anime_character(mal_id, character_data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		character_data = EXCLUDED.character_data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting anime character data into database: ', err);
	}
}

export async function getAnimeCharactersByMalId(mal_id: number) {
	const result: QueryResult<DatabaseCharacterResponse> = await pool.query(
		`SELECT character_data, created_at, last_updated_at FROM anime_character WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0]
}
