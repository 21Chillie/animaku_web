import { Request, Response } from "express";
import { DatabaseMangaTypes } from "../types/database.types";
import { getOldMangaTop, deleteOldMangaTop, getAllMangaTop, getMangaTopLimit } from "../models/mangaTopModel";
import { fetchTopMangaBatch } from "../services/fetchTopManga.service";
import { seedTableMangaTop } from "../models/mangaTopSeedTable";

export async function getMangaTop(req: Request, res: Response) {
	const daysThreshold = 30;
	const maxPage = 4;

	try {
		const oldMangaTopDB = await getOldMangaTop(daysThreshold);
		if (oldMangaTopDB.length > 0) {
			console.log(`Found ${oldMangaTopDB.length} records older than 30 days, deleting...`);

			const deleteResult = await deleteOldMangaTop(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		const mangaTopDB = await getAllMangaTop();

		if (mangaTopDB.length === 0) {
			console.log("Database empty, fetching from api...");
			const dataFromAPI = await fetchTopMangaBatch(maxPage);

			await seedTableMangaTop(dataFromAPI);

			// Transform data from API, so the structure is same as from database
			const transformedDataAPI: DatabaseMangaTypes[] = dataFromAPI.map((manga, index) => ({
				id: index + 1, // Temporary ID since it doesn't have real DB ID yet
				mal_id: manga.mal_id,
				data: manga, // Entire anime object goes in data field
				title: manga.title,
				score: manga.score,
				type: manga.type,
				status: manga.status,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}));

			console.log("Showing data from API");
			return res.status(200).json({ success: true, data: transformedDataAPI, source: "API" });
		}

		console.log("Showing data from database");
		res.status(200).json({ success: true, data: mangaTopDB, source: "Database" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: "Something went wrong while getting top manga data" });
	}
}
