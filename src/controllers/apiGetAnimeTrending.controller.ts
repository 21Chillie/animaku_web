import { Request, Response } from 'express';
import { seedTableAnime } from '../models/anime/animeDBSeedTable';
import {
	deleteOldAnimeTrending,
	getAllAnimeTrending,
	getOldAnimeTrending,
} from '../models/anime/animeTrendingModel';
import { seedTableAnimeTrending } from '../models/anime/animeTrendingSeedTable';
import { fetchAnimeTrendingBatch } from '../services/fetchAnimeTrending.service';

export async function getAnimeTrending(req: Request, res: Response) {
	// 2 weeks
	const daysThreshold = 14;
	// Recommended 6,
	const maxPage = 6;

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
		let animeTrendingDB = await getAllAnimeTrending();

		// If its less or equal than 100, then fetch fresh data and inserting to database
		if (animeTrendingDB.length <= 100) {
			console.log('Database empty, fetching from api...');

			const dataFromAPI = await fetchAnimeTrendingBatch(maxPage);
			await seedTableAnimeTrending(dataFromAPI);
			await seedTableAnime(dataFromAPI);
			animeTrendingDB = await getAllAnimeTrending();

			console.log('Successfully inserting into database');
		}

		console.log('Showing trending anime list');

		res.status(200).json({ success: true, data: animeTrendingDB, source: 'Database' });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ success: false, error: 'Something went wrong while getting anime trending data' });
	}
}
