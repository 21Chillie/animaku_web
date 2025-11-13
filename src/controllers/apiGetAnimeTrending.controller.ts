import { Request, Response } from "express";
import { fetchAnimeTrendingBatch } from "../services/fetchAnimeTrending.service";
import { seedTableAnimeTrending } from "../models/animeTrendingSeedTable";
import { DatabaseAnimeTypes } from "../types/databaseAnime.types";
import { deleteOldAnimeTrending, getAllAnimeTrending, getOldAnimeTrending } from "../models/animeTrendingModel";

export async function getAnimeTrending(req: Request, res: Response) {
	// 30 days or 1 month
	const daysThreshold = 30;
	// Recommended 4, but not limited to 4
	const maxPage = 4;

	try {
		// Get records from 'anime_trending' table that older than `dayThreshold` days
		const oldAnimeTrendingDB = await getOldAnimeTrending(daysThreshold);

		// If there is any old records within `daysThreshold` days, will be deleted.
		if (oldAnimeTrendingDB.length > 0) {
			console.log(`Found ${oldAnimeTrendingDB.length} records older than 30 days, deleting...`);

			const deleteResult = await deleteOldAnimeTrending(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		// Get all records from 'anime_trending' table
		const animeTrendingDB = await getAllAnimeTrending();

		// If its empty, then fetch fresh data and inserting to database
		if (animeTrendingDB.length === 0) {
			console.log("Database empty, fetching from api...");

			const dataFromAPI = await fetchAnimeTrendingBatch(maxPage);

			await seedTableAnimeTrending(dataFromAPI);

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
		res.status(200).json({ success: true, data: animeTrendingDB, source: "Database" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: "Something went wrong while getting anime trending data" });
	}
}
