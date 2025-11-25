import type { Request, Response } from 'express';
import { seedTableAnime } from '../../models/anime/animeDBSeedTable';
import {
	deleteOldAnimeTop,
	getAnimeTopLimit,
	getOldAnimeTop,
} from '../../models/anime/animeTopModel';
import { seedTableAnimeTop } from '../../models/anime/animeTopSeedTable';
import {
	deleteOldAnimeTrending,
	getAnimeTrendingLimit,
	getOldAnimeTrending,
} from '../../models/anime/animeTrendingModel';
import { seedTableAnimeTrending } from '../../models/anime/animeTrendingSeedTable';
import { seedTableManga } from '../../models/manga/mangaDBSeedTable';
import {
	deleteOldMangaTop,
	getMangaTopLimit,
	getOldMangaTop,
} from '../../models/manga/mangaTopModel';
import { seedTableMangaTop } from '../../models/manga/mangaTopSeedTable';
import { fetchAnimeTrendingBatch } from '../../services/fetchAnimeTrending.service';
import { fetchTopAnimeBatch } from '../../services/fetchTopAnime.service';
import { fetchTopMangaBatch } from '../../services/fetchTopManga.service';
import { DatabaseAnimeTypes, DatabaseMangaTypes } from '../../types/database.types';

async function getAnimeTrending(): Promise<DatabaseAnimeTypes[]> {
	const daysThreshold = 7;
	// The value max to 25
	const maxRecords = 10;
	// Recommended max 4, but not limited to 4 (Each page has 25 records)
	const maxPage = 1;
	try {
		const oldAnimeDatabase = await getOldAnimeTrending(daysThreshold);

		if (oldAnimeDatabase.length > 0) {
			console.log(`Found ${oldAnimeDatabase.length} records older than 30 days, deleting...`);
			const deleteResult = await deleteOldAnimeTrending(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		let animeTrendingDatabase = await getAnimeTrendingLimit(maxRecords);

		if (animeTrendingDatabase.length === 0) {
			const dataFromAPI = await fetchAnimeTrendingBatch(maxPage);
			await seedTableAnimeTrending(dataFromAPI);
			await seedTableAnime(dataFromAPI);
			animeTrendingDatabase = await getAnimeTrendingLimit(maxRecords);
		}

		return animeTrendingDatabase;
	} catch (err) {
		console.error(err);
		throw new Error('Something went wrong while fetching anime trending data');
	}
}

async function getAnimeTop(): Promise<DatabaseAnimeTypes[]> {
	const daysThreshold = 60;
	// The value max to 25
	const maxRecords = 10;
	// Recommended 4, but not limited to 4 (Each page has 25 records)
	const maxPage = 1;

	try {
		const oldAnimeDB = await getOldAnimeTop(daysThreshold);

		if (oldAnimeDB.length > 0) {
			console.log(`Found ${oldAnimeDB.length} records older than 30 days, deleting...`);
			const deleteResult = await deleteOldAnimeTop(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		let animeTopDB = await getAnimeTopLimit(maxRecords);

		if (animeTopDB.length === 0) {
			const dataFromAPI = await fetchTopAnimeBatch(maxPage);
			await seedTableAnimeTop(dataFromAPI);
			await seedTableAnime(dataFromAPI);
			animeTopDB = await getAnimeTopLimit(maxRecords);
		}

		return animeTopDB;
	} catch (err) {
		console.error(err);
		throw new Error('Something went wrong while fetching anime trending data');
	}
}

async function getMangaTop(): Promise<DatabaseMangaTypes[]> {
	const dayThreshold = 60;
	const maxRecords = 10;
	const maxPage = 1;

	try {
		const oldMangaDB = await getOldMangaTop(dayThreshold);

		if (oldMangaDB.length > 0) {
			console.log(`Found ${oldMangaDB.length} records older than 30 days, deleting...`);
			const deleteResult = await deleteOldMangaTop(dayThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		let mangaTopDB = await getMangaTopLimit(maxRecords);

		if (mangaTopDB.length === 0) {
			const dataFromAPI = await fetchTopMangaBatch(maxPage);
			await seedTableMangaTop(dataFromAPI);
			await seedTableManga(dataFromAPI);
			mangaTopDB = await getMangaTopLimit(maxRecords);
		}

		return mangaTopDB;
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
