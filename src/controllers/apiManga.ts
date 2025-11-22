import type { Request, Response } from 'express';
import { getAllManga } from '../models/manga/mangaDB.model';
import { seedTableManga } from '../models/manga/mangaDBSeedTable';
import { fetchTopMangaBatch } from '../services/fetchTopManga.service';

export async function getManga(req: Request, res: Response) {
	// Recommended 20, but not limited to 20
	const maxPage = 100;

	try {
		let mangaDatabase = await getAllManga();

		if (mangaDatabase.length <= 1000) {
			console.log('Database empty, fetching from api...');

			// Fetch Data then seed to database
			const dataFromAPI = await fetchTopMangaBatch(maxPage);
			await seedTableManga(dataFromAPI);
			mangaDatabase = await getAllManga();
			console.log('Successfully inserting into database');
		}

		console.log('Showing top anime list');

		res.status(200).json({ success: true, data: mangaDatabase, source: 'Database' });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ success: false, error: 'Something went wrong while getting manga data' });
	}
}
