import pool from "../config/database.config";
import { Anime } from "../types/animeData.types";

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
		}
		await client.query("COMMIT");

		const checkDatabase = await client.query(`SELECT * FROM anime_trending`);

		console.log(`Successfully inserting trending anime data list (${checkDatabase.rowCount} / ${trendingAnimeList.length})`);
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
