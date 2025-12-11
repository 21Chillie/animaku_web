import type { Request, Response } from 'express';
import { seedTableAnime } from '../../models/anime/animeDBSeedTable';
import {
	deleteAllOldAnimeTop,
	getAnimeTopLimit,
	getOldAnimeTop,
} from '../../models/anime/animeTopModel';
import { seedTableAnimeTop } from '../../models/anime/animeTopSeedTable';
import {
	deleteAllOldAnimeTrending,
	getAnimeTrendingLimit,
	getOldAnimeTrending,
} from '../../models/anime/animeTrendingModel';
import { seedTableAnimeTrending } from '../../models/anime/animeTrendingSeedTable';
import { seedTableManga } from '../../models/manga/mangaDBSeedTable';
import {
	deleteAllOldMangaTop,
	getMangaTopLimit,
	getOldMangaTop,
} from '../../models/manga/mangaTopModel';
import { seedTableMangaTop } from '../../models/manga/mangaTopSeedTable';
import { fetchAnimeTrendingBatch } from '../../services/fetchAnimeTrending.service';
import { fetchTopAnimeBatch } from '../../services/fetchTopAnime.service';
import { fetchTopMangaBatch } from '../../services/fetchTopManga.service';
import { DatabaseAnimeTypes, DatabaseMangaTypes } from '../../types/database.types';

async function getAnimeTrending(): Promise<DatabaseAnimeTypes[]> {
	const daysThreshold = 14;
	// The value max to 25
	const maxRecords = 10;
	// Recommended 4, but not limited to 4 (Each page has 25 records)
	const maxPage = 1;
	try {
		const oldAnimeTrendingDatabase = await getOldAnimeTrending(daysThreshold);

		if (oldAnimeTrendingDatabase.length !== 0) {
			console.log(
				`Found ${oldAnimeTrendingDatabase?.length} records older than ${daysThreshold} days, deleting all records...`
			);
			await deleteAllOldAnimeTrending();
		}

		let animeTrendingDatabase = await getAnimeTrendingLimit(maxRecords);

		if (animeTrendingDatabase.length === 0) {
			console.log("Table 'anime_trending' records is empty, fetch fresh data...");
			const dataFromAPI = await fetchAnimeTrendingBatch(maxPage);
			await seedTableAnimeTrending(dataFromAPI);
			await seedTableAnime(dataFromAPI);
			animeTrendingDatabase = await getAnimeTrendingLimit(maxRecords);
		}

		return animeTrendingDatabase;
	} catch (err) {
		console.error('Unexpected error in getAnimeTrending():', err);
		throw new Error('An unexpected error occurred while retrieving media data.');
	}
}

async function getAnimeTop(): Promise<DatabaseAnimeTypes[]> {
	const daysThreshold = 30;
	// The value max to 25
	const maxRecords = 10;
	// Recommended 4, but not limited to 4 (Each page has 25 records)
	const maxPage = 1;

	try {
		const oldAnimeTopDatabase = await getOldAnimeTop(daysThreshold);

		if (oldAnimeTopDatabase.length !== 0) {
			console.log(
				`Found ${oldAnimeTopDatabase?.length} records older than 30 days, deleting records...`
			);
			await deleteAllOldAnimeTop();
		}

		let animeTopDB = await getAnimeTopLimit(maxRecords);

		if (animeTopDB.length === 0) {
			console.log(`Table 'anime_top' records is empty, fetch fresh data...`);
			const dataFromAPI = await fetchTopAnimeBatch(maxPage);
			await seedTableAnimeTop(dataFromAPI);
			await seedTableAnime(dataFromAPI);
			animeTopDB = await getAnimeTopLimit(maxRecords);
		}

		return animeTopDB;
	} catch (err) {
		console.error('Unexpected error in getAnimeTop():', err);
		throw new Error('An unexpected error occurred while retrieving media data.');
	}
}

async function getMangaTop(): Promise<DatabaseMangaTypes[]> {
	const dayThreshold = 30;
	const maxRecords = 10;
	const maxPage = 1;

	try {
		const oldMangaDB = await getOldMangaTop(dayThreshold);

		if (oldMangaDB.length !== 0) {
			console.log(`Found ${oldMangaDB.length} records older than 30 days, deleting data...`);
			await deleteAllOldMangaTop();
		}

		let mangaTopDB = await getMangaTopLimit(maxRecords);

		if (mangaTopDB.length === 0) {
			console.log(`Table 'manga_top' records is empty, fetch fresh data...`);
			const dataFromAPI = await fetchTopMangaBatch(maxPage);
			await seedTableMangaTop(dataFromAPI);
			await seedTableManga(dataFromAPI);
			mangaTopDB = await getMangaTopLimit(maxRecords);
		}

		return mangaTopDB;
	} catch (err) {
		console.error('Unexpected error in getMangaTop():', err);
		throw new Error('An unexpected error occurred while retrieving media data.');
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
		if (err instanceof Error) {
			console.error('Error while rendering index page:', err);
			return res
				.status(500)
				.json({ status_code: 500, error: 'Internal Server Error', message: err.message });
		}
	}
}
