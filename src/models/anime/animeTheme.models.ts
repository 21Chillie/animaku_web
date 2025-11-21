import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { AnimeThemes, DatabaseThemesResponse } from '../../types/animeTheme.types';

export async function insertAnimeThemesByMalId(mal_id: number, themes: AnimeThemes) {
	try {
		await pool.query(
			`
      INSERT INTO anime_theme(mal_id, themes)
      VALUES ($1, $2)
      ON CONFLICT (mal_id)
      DO UPDATE SET 
      themes = EXCLUDED.themes,
      last_updated_at = CURRENT_TIMESTAMP
			`,
			[mal_id, themes]
		);
	} catch (err) {
		console.error('Error while inserting anime themes data into database: ', err);
	}
}

export async function getAnimeThemesByMalId(mal_id: number): Promise<DatabaseThemesResponse> {
	const result: QueryResult<DatabaseThemesResponse> = await pool.query(
		`SELECT * from anime_theme WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0];
}
