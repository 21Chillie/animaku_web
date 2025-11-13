import { Request, Response } from "express";
import { DatabaseAnimeTypes } from "../types/databaseAnime.types";
import { getOldAnimeTop, deleteOldAnimeTop, getAllAnimeTop } from "../models/animeTopModel";
import { fetchTopAnimeBatch } from "../services/fetchTopAnime.service";
import { seedTableAnimeTop } from "../models/animeTopSeedTable";

export async function getAnimeTop(req: Request, res: Response) {
	// 30 days or 1 month
	const daysThreshold = 30;
	// Recommended 4, but not limited to 4
	const maxPage = 4;

	try {
		const oldAnimeTopDB = await getOldAnimeTop(daysThreshold);

		if (oldAnimeTopDB.length > 0) {
			console.log(`Found ${oldAnimeTopDB.length} records older than 30 days, deleting...`);

			const deleteResult = await deleteOldAnimeTop(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		const animeTopDB = await getAllAnimeTop();

		if (animeTopDB.length === 0) {
			console.log("Database empty, fetching from api...");

			const dataFromAPI = await fetchTopAnimeBatch(maxPage);

			await seedTableAnimeTop(dataFromAPI);

			// Transform data from API, so the structure is same as from database
			const transformedDataAPI: DatabaseAnimeTypes[] = dataFromAPI.map((anime, index) => ({
				id: index + 1, // Temporary ID since it doesn't have real DB ID yet
				mal_id: anime.mal_id,
				data: anime, // Entire anime object goes in data field
				title: anime.title,
				score: anime.score,
				type: anime.type,
				status: anime.status,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}));

			console.log("Showing data from API");
			return res.status(200).json({ success: true, data: transformedDataAPI, source: "API" });
		}

		console.log("Showing data from database");
		res.status(200).json({ success: true, data: animeTopDB, source: "Database" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: "Something went wrong while getting top anime data" });
	}
}
