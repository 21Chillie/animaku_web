import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { CharacterFull, DatabaseCharacterFullResponse } from '../../types/characterFullData.types';

export async function insertCharacterFullByMalId(data: CharacterFull): Promise<void> {
	try {
		await pool.query(
			`
			INSERT INTO character_full(mal_id, data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		data = EXCLUDED.data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[data.mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting character full data into database: ', err);
	}
}

export async function getCharacterFullByMalId(mal_id: number) {
	try {
		const data: QueryResult<DatabaseCharacterFullResponse> = await pool.query(
			`
      SELECT * FROM character_full
      WHERE mal_id = $1
      `,
			[mal_id]
		);

		return data.rows[0];
	} catch (err) {
		console.error('Error while get character full data from database: ', err);
	}
}

export async function getOldCharacterFullByMalId(mal_id: number, daysThreshold: number) {
	try {
		const data: QueryResult<DatabaseCharacterFullResponse> = await pool.query(
			`
            SELECT * FROM character_full
            WHERE mal_id = $1 AND last_updated_at <= NOW() - INTERVAL '1 day' * $2;
            `,
			[mal_id, daysThreshold]
		);

		return data.rows[0];
	} catch (err) {
		console.error('Error while get old character full data from database: ', err);
	}
}
