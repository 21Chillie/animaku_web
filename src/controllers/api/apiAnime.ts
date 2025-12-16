import { Request, Response } from 'express';

import {
	getAllAnime,
	getAnimeByMalId,
	getAnimePaginated,
	insertAnimeDataByMalId,
} from '../../models/anime/animeDBModel';
import { seedTableAnime } from '../../models/anime/animeDBSeedTable';
import { fetchAnimeByMalId } from '../../services/fetchTitleData';
import { fetchTopAnimeBatch } from '../../services/fetchTopAnime.service';
import { batchMediaLocks } from '../../utils/fetchLock.utils';

export async function getAnime(req: Request, res: Response) {
	// the higher the number, the longer and more data will be retrieved
	// Recommended value is 100, you can get around +- 2500 titles
	const maxPage = 1000;

	// Paginated Query Paramaters, page default to 1 and limit default 30
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 30;
	const offset = (page - 1) * limit;

	// Search filter, order by, order direction
	const search = (req.query.search as string) || '';
	const orderBy = (req.query.order_by as string) || 'rank';
	const orderDirection = (req.query.order_direction as string) || 'ASC';

	// filter by type/status
	const type = (req.query.type as string) || '';
	const status = (req.query.status as string) || '';

	try {
		let animeDatabase = await getAllAnime();

		if (animeDatabase.length < 1000) {
			await batchMediaLocks(async () => {
				const recheck = await getAllAnime();
				if (recheck.length >= 1000) return;

				console.log('Database empty, fetching from api...');

				// Fetch Data then seed to database
				const dataFromAPI = await fetchTopAnimeBatch(maxPage);
				await seedTableAnime(dataFromAPI);
				animeDatabase = await getAllAnime();
				console.log('Successfully inserting into database');
			});
		}

		// Get paginated results with search, filters, and sorting
		const { anime, totalRecords } = await getAnimePaginated(
			limit,
			offset,
			search,
			orderBy,
			orderDirection,
			type,
			status
		);
		const totalPages = Math.ceil(totalRecords / limit);

		if (limit > 30) {
			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: `The input limit value is ${limit} and it's higher than the configured '30'`,
			});
		}

		res.status(200).json({
			success: true,
			data: anime,
			pagination: {
				currentPage: page,
				totalPages: totalPages,
				totalRecords: totalRecords,
				hasNext: page < totalPages,
				hasPrev: page > 1,
				limit: limit,
			},
			filters: {
				search,
				type,
				status,
				orderBy,
				orderDirection,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			error: 'Internal Server Error',
			message: 'Something went wrong while getting anime data',
		});
	}
}

export async function getAnimeById(req: Request, res: Response) {
	const mal_id = parseInt(req.params.id);

	if (isNaN(mal_id)) {
		console.log('Invalid title mal_id');
		return res.status(400).json({
			success: false,
			error: 'Bad Request',
			message: 'Invalid title mal_id, the mal_id must be a number',
		});
	}

	try {
		let animeData = await getAnimeByMalId(mal_id);

		if (!animeData) {
			console.log(`Anime title with mal_id ${mal_id} is not found, fetch from API`);
			const dataFromAPI = await fetchAnimeByMalId(mal_id);

			if (!dataFromAPI) {
				return res.status(404).json({
					success: false,
					error: 'Resource Not Found',
					message: `Anime with mal id ${mal_id} does not exist`,
				});
			}

			await insertAnimeDataByMalId(dataFromAPI);
			animeData = await getAnimeByMalId(mal_id);
		}

		res.status(200).json({ success: true, data: animeData });
	} catch (err) {
		if (err instanceof Error) {
			console.error('Error fetching anime:', err);
			return res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				message: `Something went wrong while getting anime with mal id ${mal_id}`,
			});
		}
	}
}
