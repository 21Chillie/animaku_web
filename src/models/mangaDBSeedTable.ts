import { QueryResult } from 'pg';
import pool from '../config/database.config';
import { Manga } from '../types/mangaData.types';

export async function seedTableMangaTop(mangaList: Manga[]): Promise<void> {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		for (const manga of mangaList) {
			await client.query(
				`
				INSERT INTO manga(mal_id, data)
				VALUES ($1, $2)
				ON CONFLICT (mal_id)
				DO UPDATE SET 
    				data = EXCLUDED.data,
    				last_updated_at = CURRENT_TIMESTAMP;
          `,
				[manga.mal_id, manga]
			);
		}
		await client.query('COMMIT');

		const checkDatabase: QueryResult<Manga[]> = await client.query(`SELECT id FROM manga`);

		console.log(
			`Successfully inserting manga data list (${checkDatabase.rowCount} / ${mangaList.length})`
		);
	} catch (err) {
		await client.query('ROLLBACK');

		if (err instanceof Error) {
			console.error("Error while seeding table 'manga': ", err.message);
		}

		throw new Error("Something went wrong while seeding table 'manga'");
	} finally {
		client.release();
	}
}
