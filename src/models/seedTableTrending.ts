import pool from "../config/database.config";
import { Anime } from "../types/animeTrendingData.types";

export async function seedTableAnimeTrending(trendingAnimeList: Anime[]): Promise<void> {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		for (const anime of trendingAnimeList) {
			await client.query(
				`
      INSERT INTO anime_trending(mal_id, data)
      VALUES ($1, $2)
      ON CONFLICT (mal_id)
      DO UPDATE SET data = EXCLUDED.data
      `,
				[anime.mal_id, anime]
			);

			console.log(`Sucess inserting anime trending data with mal_id ${anime.mal_id}`);
		}
		console.log("Success inserting all anime trending data");

		await client.query("COMMIT");
	} catch (err) {
		await client.query("ROLLBACK");

		if (err instanceof Error) {
			console.error("Error while seeding table 'anime_trending': ", err.message);
		}

		throw new Error("Something went wrong while seeding table 'anime_trending'");
	} finally {
		client.release();
	}
}
