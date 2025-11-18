import { QueryResult } from 'pg';
import pool from '../config/database.config';
import { Anime } from '../types/animeData.types';

export async function seedTableAnime(animeList: Anime[]): Promise<void> {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		for (const anime of animeList) {
			await client.query(
				`
				INSERT INTO anime(mal_id, data)
				VALUES ($1, $2)
				ON CONFLICT (mal_id)
				DO UPDATE SET 
    				data = EXCLUDED.data,
    				last_updated_at = CURRENT_TIMESTAMP;
      	`,
				[anime.mal_id, anime]
			);
		}
		await client.query('COMMIT');

		const checkDatabase: QueryResult<Anime[]> = await client.query(`SELECT id FROM anime`);

		console.log(
			`Successfully inserting anime data list (${checkDatabase.rowCount})`
		);
	} catch (err) {
		await client.query('ROLLBACK');

		if (err instanceof Error) {
			console.error("Error while seeding table 'anime': ", err.message);
		}

		throw new Error("Something went wrong while seeding table 'anime'");
	} finally {
		client.release();
	}
}
