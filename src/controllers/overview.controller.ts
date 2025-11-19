import type { Request, Response } from 'express';
import { getAnimeByMalId, insertAnimeDataByMalId } from '../models/anime/animeDBModel';
import {
	getAnimeCharactersByMalId,
	insertAnimeCharacterByMalId,
} from '../models/other/character.model';
import {
	getAnimeRelationByMalId,
	insertAnimeRelationByMalId,
} from '../models/other/relation.model';
import {
	fetchAnimeByMalId,
	fetchAnimeCharactersByMalId,
	fetchAnimeRelationByMalId,
} from '../services/fetchTitleData';

async function getAnimeData(mal_id: number) {
	try {
		// 1. Get or fetch anime data
		let animeData = await getAnimeByMalId(mal_id);

		if (!animeData) {
			console.log('Run fetch anime');
			const dataFromAPI = await fetchAnimeByMalId(mal_id);
			await insertAnimeDataByMalId(dataFromAPI);
			animeData = await getAnimeByMalId(mal_id);
		}

		// 2. Get or fetch character data
		let animeCharacter = await getAnimeCharactersByMalId(mal_id);

		if (!animeCharacter) {
			console.log('Run fetch anime character');
			const dataFromAPI = await fetchAnimeCharactersByMalId(mal_id);
			await insertAnimeCharacterByMalId(mal_id, dataFromAPI);
			animeCharacter = await getAnimeCharactersByMalId(mal_id);
		}

		// 3. Get or fetch relation data
		let animeRelation = await getAnimeRelationByMalId(mal_id);

		if (!animeRelation) {
			console.log('Run fetch anime relation');
			const dataFromAPI = await fetchAnimeRelationByMalId(mal_id);
			await insertAnimeRelationByMalId(mal_id, dataFromAPI);
			animeRelation = await getAnimeRelationByMalId(mal_id);
		}

		// 4. Get or fetch recommendation data
		// TODO: create get or fetch anime recommendation logic

		return {
			anime: animeData,
			character: animeCharacter,
			relation: animeRelation,
		};
	} catch (err) {
		console.error('Error in getAnimeData:', err);
		throw err; // Re-throw to let caller handle it
	}
}

async function getMangaData(mal_id: number) {
	// TODO: Do the same as getAnimeData()
}

export async function renderOverview(req: Request, res: Response) {
	const id = parseInt(req.params.id);
	const type = req.params.type;

	if (type === 'anime') {
		return res.status(200).json(await getAnimeData(id));
	}
}
