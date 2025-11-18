import { Request, Response } from 'express';
import { deleteOldMangaTop, getAllMangaTop, getOldMangaTop } from '../models/mangaTopModel';
import { seedTableMangaTop } from '../models/mangaTopSeedTable';
import { fetchTopMangaBatch } from '../services/fetchTopManga.service';
import { DatabaseMangaTypes } from '../types/database.types';

export async function getMangaTop(req: Request, res: Response) {
	const daysThreshold = 30;
	const maxPage = 40;
	const topMangaList: DatabaseMangaTypes[] = [];

	try {
		const oldMangaTopDB = await getOldMangaTop(daysThreshold);
		if (oldMangaTopDB.length > 0) {
			console.log(`Found ${oldMangaTopDB.length} records older than 30 days, deleting...`);

			const deleteResult = await deleteOldMangaTop(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		const mangaTopDB = await getAllMangaTop();

		if (mangaTopDB.length <= 100) {
			console.log('Database empty, fetching from api...');

			const dataFromAPI = await fetchTopMangaBatch(maxPage);
			await seedTableMangaTop(dataFromAPI);
			await seedTableMangaTop(dataFromAPI);
			const mangaTopDB = await getAllMangaTop();
			topMangaList.push(...mangaTopDB);

			console.log('Successfully inserting data into database');
		}

		topMangaList.push(...mangaTopDB);

		console.log('Showing top manga list');

		res.status(200).json({ success: true, data: topMangaList, source: 'Database' });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ success: false, error: 'Something went wrong while getting top manga data' });
	}
}
