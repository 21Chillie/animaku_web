import { Request, Response } from 'express';
import { seedTableManga } from '../../models/manga/mangaDBSeedTable';

import {
	deleteAllOldMangaTop,
	getAllMangaTop,
	getMangaTopCount,
	getMangaTopPaginated,
	getOldMangaTop,
} from '../../models/manga/mangaTopModel';
import { seedTableMangaTop } from '../../models/manga/mangaTopSeedTable';
import { fetchTopMangaBatch } from '../../services/fetchTopManga.service';
import { batchMediaLocks, mediaLocks } from '../../utils/fetchLock.utils';

export async function getMangaTop(req: Request, res: Response) {
	const daysThreshold = 30;
	const maxPage = 4;

	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 25;
	const offset = (page - 1) * limit;

	try {
		/** 
		* * Uncomment line below if you want to use it 
		const oldMangaTopDB = await getOldMangaTop(daysThreshold);
		if (oldMangaTopDB.length !== 0) {
			console.log(
				`Found ${oldMangaTopDB.length} records older than ${daysThreshold} days, updating data...`
			);
			await deleteAllOldMangaTop();
		}
		*/

		let mangaTopDB = await getAllMangaTop();

		if (mangaTopDB.length < 26) {
			await batchMediaLocks(async () => {
				const recheck = await getAllMangaTop();
				if (recheck.length >= 26) return;

				console.log(`Table 'manga_top' records is empty, fetch fresh data...`);

				const dataFromAPI = await fetchTopMangaBatch(maxPage);
				await seedTableMangaTop(dataFromAPI);
				await seedTableManga(dataFromAPI);
				mangaTopDB = await getAllMangaTop();

				console.log('Successfully inserting data into database');
			});
		}

		const paginatedTopManga = await getMangaTopPaginated(limit, offset);
		const totalRecords = await getMangaTopCount();
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
			data: paginatedTopManga,
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
			.json({ success: false, error: 'Something went wrong while getting top manga data' });
	}
}
