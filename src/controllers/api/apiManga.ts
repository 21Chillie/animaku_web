import type { Request, Response } from 'express';

import {
	getAllManga,
	getMangaByMalId,
	getMangaPaginated,
	insertMangaDataByMalId,
} from '../../models/manga/mangaDB.model';
import { seedTableManga } from '../../models/manga/mangaDBSeedTable';
import { fetchMangaByMalId } from '../../services/fetchTitleData';
import { fetchTopMangaBatch } from '../../services/fetchTopManga.service';
import { batchMediaLocks } from '../../utils/fetchLock.utils';

export async function getManga(req: Request, res: Response) {
	// the higher the number, the longer and more data will be retrieved
	// Recommended value is 100, you can get around +- 2500 titles
	const maxPage = 1000;

	// Paginated Query Paramaters, default to 1
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 30;
	const offset = (page - 1) * limit;

	// Search filter, order by
	const search = (req.query.search as string) || '';
	const orderBy = (req.query.order_by as string) || 'rank';
	const orderDirection = (req.query.order_direction as string) || 'ASC';

	// filter by type/status
	const type = (req.query.type as string) || '';
	const status = (req.query.status as string) || '';

	try {
		let mangaDatabase = await getAllManga();

		if (mangaDatabase.length < 1000) {
			await batchMediaLocks(async () => {
				const recheck = await getAllManga();
				if (recheck.length >= 1000) return;

				console.log('Database empty, fetching from api...');

				// Fetch Data then seed to database
				const dataFromAPI = await fetchTopMangaBatch(maxPage);
				await seedTableManga(dataFromAPI);
				mangaDatabase = await getAllManga();
				console.log('Successfully inserting into database');
			});
		}

		// Get paginated results with search, filters, and sorting
		const { manga, totalRecords } = await getMangaPaginated(
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
			res.status(400).json({
				status: 400,
				success: false,
				message: `The input limit value is ${limit} and it's higher than the configured '30'`,
			});
		}

		res.status(200).json({
			success: true,
			data: manga,
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
			source: 'Database',
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			error: 'Internal Server Error',
			message: 'Something went wrong while getting manga data',
		});
	}
}

export async function getMangaById(req: Request, res: Response) {
	const mal_id = parseInt(req.params.id);

	if (isNaN(mal_id)) {
		console.log('Invalid title mal_id');
		return res.status(401).json({
			success: false,
			error: 'Bad Request',
			message: 'Invalid title mal_id, the mal_id must be a number',
		});
	}

	try {
		let mangaData = await getMangaByMalId(mal_id);

		if (!mangaData) {
			console.log(`Manga title with mal_id ${mal_id} is not found, fetch from API`);
			const dataFromAPI = await fetchMangaByMalId(mal_id);

			if (!dataFromAPI) {
				return res.status(404).json({
					success: false,
					error: 'Resource Not Found',
					message: `Manga with mal id ${mal_id} does not exist`,
				});
			}

			await insertMangaDataByMalId(dataFromAPI);
			mangaData = await getMangaByMalId(mal_id);
		}

		res.status(200).json({ success: true, data: mangaData });
	} catch (err) {
		if (err instanceof Error) {
			console.error('Error fetching manga:', err);
			return res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				message: `Something went wrong while getting manga with mal id ${mal_id}`,
			});
		}
	}
}
