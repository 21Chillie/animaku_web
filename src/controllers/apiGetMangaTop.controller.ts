import { Request, Response } from 'express';
import { seedTableManga } from '../models/manga/mangaDBSeedTable';
import { deleteOldMangaTop, getAllMangaTop, getOldMangaTop } from '../models/manga/mangaTopModel';
import { seedTableMangaTop } from '../models/manga/mangaTopSeedTable';
import { fetchTopMangaBatch } from '../services/fetchTopManga.service';

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

		let mangaTopDB = await getAllMangaTop();

		if (mangaTopDB.length <= 100) {
			console.log('Database empty, fetching from api...');

			const dataFromAPI = await fetchTopMangaBatch(maxPage);
			await seedTableMangaTop(dataFromAPI);
			await seedTableManga(dataFromAPI);
			mangaTopDB = await getAllMangaTop();

			console.log('Successfully inserting data into database');
		}

		console.log('Showing top manga list');

		res.status(200).json({ success: true, data: mangaTopDB, source: 'Database' });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ success: false, error: 'Something went wrong while getting top manga data' });
	}
}
