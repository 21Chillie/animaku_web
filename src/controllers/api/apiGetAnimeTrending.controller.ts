import { Request, Response } from 'express';
import { seedTableAnime } from '../../models/anime/animeDBSeedTable';

import {
	deleteOldAnimeTrending,
	getAllAnimeTrending,
	getAnimeTrendingCount,
	getAnimeTrendingPaginated,
	getOldAnimeTrending,
} from '../../models/anime/animeTrendingModel';
import { seedTableAnimeTrending } from '../../models/anime/animeTrendingSeedTable';
import { fetchAnimeTrendingBatch } from '../../services/fetchAnimeTrending.service';

export async function getAnimeTrending(req: Request, res: Response) {
	// 2 weeks
	const daysThreshold = 14;
	// Recommended 6,
	const maxPage = 6;

	const page = Number(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 25;
	const offset = (page - 1) * limit;

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

		const paginatedTrendingAnime = await getAnimeTrendingPaginated(limit, offset);
		const totalRecords = await getAnimeTrendingCount();
		const totalPages = Math.ceil(totalRecords / limit);

		if (limit > 25) {
			return res.status(400).json({
				status: 400,
				success: false,
				message: `The input limit value is ${limit} and it's higher than the configured '25'`,
			});
		}

		if (page > totalPages) {
			return res.status(400).json({
				status: 400,
				success: false,
				message: `The input pages value is ${page} and it's higher than total pages ${totalPages}`,
			});
		}

		res.status(200).json({
			success: true,
			data: paginatedTrendingAnime,
			pagination: {
				currentPage: page,
				totalPages: totalPages,
				totalRecords: totalRecords,
				hasNext: page < totalPages,
				hasPrev: page > 1,
				limit: limit,
			},
			source: 'Database',
		});
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ success: false, error: 'Something went wrong while getting anime trending data' });
	}
}
