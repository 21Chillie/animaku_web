import { Request, Response } from 'express';
import { seedTableAnime } from '../models/anime/animeDBSeedTable';
import { deleteOldAnimeTop, getAllAnimeTop, getOldAnimeTop } from '../models/anime/animeTopModel';
import { seedTableAnimeTop } from '../models/anime/animeTopSeedTable';
import { fetchTopAnimeBatch } from '../services/fetchTopAnime.service';

export async function getAnimeTop(req: Request, res: Response) {
	// 30 days or 1 month
	const daysThreshold = 30;
	// Recommended 4, you can do more than that
	const maxPage = 4;

	try {
		// Check old anime top db
		const oldAnimeTopDB = await getOldAnimeTop(daysThreshold);

		// if there is records that has older than 30 days, delete the data
		if (oldAnimeTopDB.length > 0) {
			console.log(`Found ${oldAnimeTopDB.length} records older than 30 days, deleting...`);
			const deleteResult = await deleteOldAnimeTop(daysThreshold);
			console.log(`Deleted ${deleteResult} old records.`);
		}

		// After that will check anime top records
		let animeTopDB = await getAllAnimeTop();

		// if the records is less or equal than 100, will fetch fresh data from api
		if (animeTopDB.length <= 100) {
			console.log('Database empty, fetching from api...');

			// Fetch Data then seed to database (anime_top and anime tables)
			const dataFromAPI = await fetchTopAnimeBatch(maxPage);
			await seedTableAnimeTop(dataFromAPI);
			await seedTableAnime(dataFromAPI);
			animeTopDB = await getAllAnimeTop();
			console.log('Successfully inserting into database');
		}

		console.log('Showing top anime list');

		res.status(200).json({ success: true, data: animeTopDB, source: 'Database' });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ success: false, error: 'Something went wrong while getting top anime data' });
	}
}
