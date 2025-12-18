import { Request, Response } from 'express';
import { seedTableAnime } from '../../models/anime/animeDBSeedTable';

import {
	getAllAnimeTop,
	getAnimeTopCount,
	getAnimeTopPaginated,
	getOldAnimeTop,
	deleteAllOldAnimeTop,
} from '../../models/anime/animeTopModel';
import { seedTableAnimeTop } from '../../models/anime/animeTopSeedTable';
import { fetchTopAnimeBatch } from '../../services/fetchTopAnime.service';
import { batchMediaLocks } from '../../utils/fetchLock.utils';

export async function getAnimeTop(req: Request, res: Response) {
	// 30 days or 1 month
	const daysThreshold = 30;
	// Recommended 4, you can do more than that
	const maxPage = 4;

	// Page and limit records
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 25;
	const offset = (page - 1) * limit;

	try {
		/**
		* * Uncomment line below if you want to use 
		// Check old anime top db
		const oldAnimeTopDB = await getOldAnimeTop(daysThreshold);

		// if there is records that has older than 30 days, delete the data
		if (oldAnimeTopDB.length !== 0) {
			console.log(
				`Found ${oldAnimeTopDB.length} records older than ${daysThreshold} days, deleting data...`
			);

			await deleteAllOldAnimeTop();
		}
		*/

		// After that will check anime top records
		let animeTopDB = await getAllAnimeTop();

		// if the records is less than x, will fetch fresh data from api
		if (animeTopDB.length < 26) {
			await batchMediaLocks(async () => {
				const recheck = await getAllAnimeTop();
				if (recheck.length >= 26) return;

				console.log(`Table 'anime_top' records is empty, fetch fresh data`);

				// Fetch Data then seed to database (anime_top and anime tables)
				const dataFromAPI = await fetchTopAnimeBatch(maxPage);
				await seedTableAnimeTop(dataFromAPI);
				await seedTableAnime(dataFromAPI);
				animeTopDB = await getAllAnimeTop();
				console.log('Successfully inserting into database');
			});
		}

		const paginatedTopAnime = await getAnimeTopPaginated(limit, offset);
		const totalRecords = await getAnimeTopCount();
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
			data: paginatedTopAnime,
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
			.json({ success: false, error: 'Something went wrong while getting top anime data' });
	}
}
