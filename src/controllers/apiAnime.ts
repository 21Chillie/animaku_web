import { Request, Response } from 'express';
import { getAllAnime } from '../models/anime/animeDBModel';
import { seedTableAnime } from '../models/anime/animeDBSeedTable';
import { fetchTopAnimeBatch } from '../services/fetchTopAnime.service';

export async function getAnime(req: Request, res: Response) {
	// Recommended 20, but not limited to 20
	const maxPage = 100;

	try {
		let animeDatabase = await getAllAnime();

		if (animeDatabase.length <= 1000) {
			console.log('Database empty, fetching from api...');

			// Fetch Data then seed to database
			const dataFromAPI = await fetchTopAnimeBatch(maxPage);
			await seedTableAnime(dataFromAPI);
			animeDatabase = await getAllAnime();
			console.log('Successfully inserting into database');
		}

		console.log('Showing top anime list');

		res.status(200).json({ success: true, data: animeDatabase, source: 'Database' });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ success: false, error: 'Something went wrong while getting anime data' });
	}
}
