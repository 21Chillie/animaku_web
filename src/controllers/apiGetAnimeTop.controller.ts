import { Request, Response } from 'express';
import { seedTableAnime } from '../models/animeDBSeedTable';
import { deleteOldAnimeTop, getAllAnimeTop, getOldAnimeTop } from '../models/animeTopModel';
import { seedTableAnimeTop } from '../models/animeTopSeedTable';
import { fetchTopAnimeBatch } from '../services/fetchTopAnime.service';
import { DatabaseAnimeTypes } from '../types/database.types';

export async function getAnimeTop(req: Request, res: Response) {
	// 30 days or 1 month
	const daysThreshold = 30;
	// Recommended 20, but not limited to 20
	const maxPage = 40;

	const animeTopList: DatabaseAnimeTypes[] = [];

	try {
		const oldAnimeTopDB = await getOldAnimeTop(daysThreshold);

		if (oldAnimeTopDB.length > 0) {
			console.log(`Found ${oldAnimeTopDB.length} records older than 30 days, deleting...`);

			const deleteResult = await deleteOldAnimeTop(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		const animeTopDB = await getAllAnimeTop();

		if (animeTopDB.length <= 100) {
			console.log('Database empty, fetching from api...');

			// Fetch Data then seed to database
			const dataFromAPI = await fetchTopAnimeBatch(maxPage);
			await seedTableAnimeTop(dataFromAPI);
			await seedTableAnime(dataFromAPI);
			const animeTopDB = await getAllAnimeTop();
			animeTopList.push(...animeTopDB);

			console.log('Successfully inserting into database');
		}

		animeTopList.push(...animeTopDB);

		console.log('Showing top anime list');

		res.status(200).json({ success: true, data: animeTopList, source: 'Database' });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ success: false, error: 'Something went wrong while getting top anime data' });
	}
}
