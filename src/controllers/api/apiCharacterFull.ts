import type { Request, Response } from 'express';
import {
	getCharacterFullByMalId,
	getOldCharacterFullByMalId,
	insertCharacterFullByMalId,
} from '../../models/character/characterFull.model';
import { fetchCharacterFullData } from '../../services/fetchCharacterFull.service';

export async function getCharacterFull(req: Request, res: Response) {
	const id = parseInt(req.params.id);
	const daysThreshold = 30;

	if (isNaN(id)) {
		return res.status(400).json({ success: false, message: "Parameter 'mal_id' must be a number" });
	}

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

		res.status(200).json({ success: true, data: characterFullData });
	} catch (err) {
		res
			.status(500)
			.json({ success: false, error: 'Something went wrong while getting character full data' });
	}
}
