import type { Request, Response } from 'express';
import { deleteOldAnimeTop, getAnimeTopLimit, getOldAnimeTop } from '../models/animeTopModel';
import { seedTableAnimeTop } from '../models/animeTopSeedTable';
import {
	deleteOldAnimeTrending,
	getAnimeTrendingLimit,
	getOldAnimeTrending,
} from '../models/animeTrendingModel';
import { seedTableAnimeTrending } from '../models/animeTrendingSeedTable';
import { getMangaTopLimit, getOldMangaTop } from '../models/mangaTopModel';
import { seedTableMangaTop } from '../models/mangaTopSeedTable';
import { fetchAnimeTrendingBatch } from '../services/fetchAnimeTrending.service';
import { fetchTopAnimeBatch } from '../services/fetchTopAnime.service';
import { fetchTopMangaBatch } from '../services/fetchTopManga.service';
import { DatabaseAnimeTypes, DatabaseMangaTypes } from '../types/database.types';

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

			console.log('Showing data from API');
			animeTrendingData.push(...transformedDataAPI.slice(0, maxRecords));
		}

		animeTrendingData.push(...animeTrendingDatabase);

		return animeTrendingData;
	} catch (err) {
		console.error(err);
		throw new Error('Something went wrong while fetching anime trending data');
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

			console.log('Showing data from API');
			animeTopData.push(...transformedDataAPI.slice(0, maxRecords));
		}

		console.log('Showing data from Database');
		animeTopData.push(...animeTopDB);

		return animeTopData;
	} catch (err) {
		console.error(err);
		throw new Error('Something went wrong while fetching anime trending data');
	}
}

async function getMangaTop(): Promise<DatabaseMangaTypes[]> {
	const dayThreshold = 30;
	const maxRecords = 10;
	const maxPage = 4;

	try {
		const mangaTopData: DatabaseMangaTypes[] = [];
		const oldMangaDB = await getOldMangaTop(dayThreshold);

		if (oldMangaDB.length > 0) {
			console.log(`Found ${oldMangaDB.length} records older than 30 days, deleting...`);
			const deleteResult = await deleteOldAnimeTop(dayThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		const mangaTopDB = await getMangaTopLimit(maxRecords);

		if (mangaTopDB.length === 0) {
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

			console.log('Showing data from API');
			mangaTopData.push(...transformedDataAPI.slice(0, maxRecords));
		}

		console.log('Showing data from Database');
		mangaTopData.push(...mangaTopDB);

		return mangaTopData;
	} catch (err) {
		console.error(err);
		throw new Error('Something went wrong while fetching anime trending data');
	}
}

export async function renderIndex(req: Request, res: Response) {
	try {
		const listTrendingAnime = await getAnimeTrending();
		const listTopAnime = await getAnimeTop();
		const listTopManga = await getMangaTop();

		res.status(200).render('index', {
			trendingAnime: listTrendingAnime,
			topAnime: listTopAnime,
			topManga: listTopManga,
		});
	} catch (err) {
		console.error('Error while rendering index page:', err);
		return res.status(500).send('Internal Server Error');
	}
}
