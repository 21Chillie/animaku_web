import type { QueryResult } from 'pg';
import pool from '../../config/database.config';
import {
	DatabaseRecommendationResponse,
	Recommendation,
} from '../../types/recommendationData.types';

export async function insertAnimeRecommendationByMalId(mal_id: number, data: Recommendation[]) {
	try {
		await pool.query(
			`
			INSERT INTO anime_recommendation(mal_id, recommendation_data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		recommendation_data = EXCLUDED.recommendation_data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting anime recommendation data into database: ', err);
	}
}

export async function getAnimeRecommendationByMalId(
	mal_id: number
): Promise<DatabaseRecommendationResponse> {
	const result: QueryResult<DatabaseRecommendationResponse> = await pool.query(
		`SELECT recommendation_data FROM anime_recommendation WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0];
}

export async function insertMangaRecommendationByMalId(mal_id: number, data: Recommendation[]) {
	try {
		await pool.query(
			`
			INSERT INTO manga_recommendation(mal_id, recommendation_data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		recommendation_data = EXCLUDED.recommendation_data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting manga recommendation data into database: ', err);
	}
}

export async function getMangaRecommendationByMalId(
	mal_id: number
): Promise<DatabaseRecommendationResponse> {
	const result: QueryResult<DatabaseRecommendationResponse> = await pool.query(
		`SELECT recommendation_data FROM manga_recommendation WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0];
}
