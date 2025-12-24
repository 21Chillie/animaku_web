import type { Request, Response } from 'express';
import {
	getCharacterFullByMalId,
	getOldCharacterFullByMalId,
	insertCharacterFullByMalId,
} from '../../models/character/characterFull.model';
import { fetchCharacterFullData } from '../../services/fetchCharacterFull.service';
import { parseSynopsis } from '../../utils/parseData.utils';
import { mediaLocks } from '../../utils/fetchLock.utils';

async function getMediaCharacterFullData(id: number, daysThreshold: number) {
	return mediaLocks(id, async () => {
		try {
			// Check old character record
			const oldCharacterData = await getOldCharacterFullByMalId(id, daysThreshold);

			// If character record is older than daysThreshold then fetch and inserting to database
			if (oldCharacterData) {
				const dataFromAPI = await fetchCharacterFullData(id);
				await insertCharacterFullByMalId(dataFromAPI);
			}

			// Get character data
			let characterFullData = await getCharacterFullByMalId(id);

			// If there is no character record with specific mal_id, then fetch fresh data from api and insert to database
			if (!characterFullData) {
				const dataFromAPI = await fetchCharacterFullData(id);
				await insertCharacterFullByMalId(dataFromAPI);
				characterFullData = await getCharacterFullByMalId(id);
			}

			const aboutCharacter = characterFullData?.data.about ?? null;

			const parseAboutCharacter = parseSynopsis(aboutCharacter);

			return {
				data: characterFullData,
				about: parseAboutCharacter,
			};
		} catch (err) {
			console.error;
			throw new Error(`Something went wrong while getting character full data`);
		}
	});
}

export async function renderCharacter(req: Request, res: Response) {
	const id = parseInt(req.params.id);
	const daysThreshold = 30;

	try {
		const { data, about } = await getMediaCharacterFullData(id, daysThreshold);

		if (!data || !about) {
			return res.render('error', {
				success: false,
				status_code: 500,
				error: 'Internal Server Error',
				message: 'Something went wrong while getting character data',
				path: req.originalUrl,
			});
		}

		res.render('character', { data, about });
	} catch (err) {
		if (err instanceof Error) {
			console.error(err);
		}

		res.render('error', {
			success: false,
			status_code: 500,
			error: 'Internal Server Error',
			message: 'Ooops something went wrong (unknown error)',
			path: req.originalUrl,
		});
	}
}
