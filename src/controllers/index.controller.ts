import type { Request, Response } from "express";
import { fetchAnimeTrendingBatch } from "../services/fetchAnimeTrending.service";
import { seedTableAnimeTrending } from "../models/animeTrendingSeedTable";
import dotenv from "dotenv";
import { DatabaseAnimeTypes } from "../types/databaseAnime.types";
import { getOldAnimeTrending, deleteOldAnimeTrending, getAnimeTrendingLimit } from "../models/animeTrendingModel";
import { deleteOldAnimeTop, getAnimeTopLimit, getOldAnimeTop } from "../models/animeTopModel";
import { fetchTopAnimeBatch } from "../services/fetchTopAnime.service";
import { seedTableAnimeTop } from "../models/animeTopSeedTable";

dotenv.config();

async function getAnimeTrending(): Promise<DatabaseAnimeTypes[]> {
	const daysThreshold = 30;
	// The value max to 25
	const maxRecords = 6;
	// Recommended 4, but not limited to 4 (Each page has 25 records)
	const maxPage = 4;
	try {
		const oldAnimeDatabase = await getOldAnimeTrending(daysThreshold);
		const animeTrendingData: DatabaseAnimeTypes[] = [];

		if (oldAnimeDatabase.length > 0) {
			console.log(`Found ${oldAnimeDatabase.length} records older than 30 days, deleting...`);
			const deleteResult = await deleteOldAnimeTrending(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		const animeTrendingDatabase = await getAnimeTrendingLimit(maxRecords);

		if (animeTrendingDatabase.length === 0) {
			const dataFromAPI = await fetchAnimeTrendingBatch(maxPage);

			await seedTableAnimeTrending(dataFromAPI);

			const transformedDataAPI: DatabaseAnimeTypes[] = dataFromAPI.map((anime, index) => ({
				id: index + 1,
				mal_id: anime.mal_id,
				data: anime,
				title: anime.title,
				score: anime.score,
				type: anime.type,
				status: anime.status,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}));

			console.log("Showing data from API");
			animeTrendingData.push(...transformedDataAPI);
		}

		animeTrendingData.push(...animeTrendingDatabase);

		return animeTrendingData;
	} catch (err) {
		console.error(err);
		throw new Error("Something went wrong while fetching anime trending data");
	}
}

async function getAnimeTop(): Promise<DatabaseAnimeTypes[]> {
	const daysThreshold = 30;
	// The value max to 25
	const maxRecords = 10;
	// Recommended 4, but not limited to 4 (Each page has 25 records)
	const maxPage = 4;

	try {
		const animeTopData: DatabaseAnimeTypes[] = [];
		const oldAnimeDB = await getOldAnimeTop(daysThreshold);

		if (oldAnimeDB.length > 0) {
			console.log(`Found ${oldAnimeDB.length} records older than 30 days, deleting...`);
			const deleteResult = await deleteOldAnimeTop(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		const animeTopDB = await getAnimeTopLimit(maxRecords);

		if (animeTopDB.length === 0) {
			const dataFromAPI = await fetchTopAnimeBatch(maxPage);
			await seedTableAnimeTop(dataFromAPI);

			const transformedDataAPI: DatabaseAnimeTypes[] = dataFromAPI.map((anime, index) => ({
				id: index + 1,
				mal_id: anime.mal_id,
				data: anime,
				title: anime.title,
				score: anime.score,
				type: anime.type,
				status: anime.status,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}));

			console.log("Showing data from API");
			animeTopData.push(...transformedDataAPI);
		}

		console.log("Showing data from Database");
		animeTopData.push(...animeTopDB);

		return animeTopData;
	} catch (err) {
		console.error(err);
		throw new Error("Something went wrong while fetching anime trending data");
	}
}

export async function renderDataIndex(req: Request, res: Response) {
	try {
		const listTrendingAnime = await getAnimeTrending();
		const listTopAnime = await getAnimeTop();

		res.status(200).render("index", { trendingAnime: listTrendingAnime, topAnime: listTopAnime });
	} catch (err) {
		console.error("Error while rendering index page:", err);
		return res.status(500).send("Internal Server Error");
	}
}
