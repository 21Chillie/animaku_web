import axios from 'axios';
import type { Request, Response } from 'express';
import { JIKAN_BASE_URL } from '../config/env.config';
import { getAnimeByMalId, insertAnimeDataByMalId } from '../models/anime/animeDBModel';
import {
	getAnimeCharactersByMalId,
	insertAnimeCharacterByMalId,
} from '../models/other/character.model';
import {
	getAnimeRecommendationByMalId,
	insertAnimeRecommendationByMalId,
} from '../models/other/recommendation.model';
import {
	getAnimeRelationByMalId,
	insertAnimeRelationByMalId,
} from '../models/other/relation.model';
import {
	fetchAnimeByMalId,
	fetchAnimeCharactersByMalId,
	fetchAnimeRecommendationByMalId,
	fetchAnimeRelationByMalId,
} from '../services/fetchTitleData';

const API_URL = JIKAN_BASE_URL;

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

		if (animeCharacter.character_data.length <= 6) {
			console.log('Not enough character, re run fetch anime character');
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

		const relPrequel = animeRelation.relation_data.find((rel) => rel.relation === 'Prequel');
		const relSequel = animeRelation.relation_data.find((rel) => rel.relation === 'Sequel');
		const relAdaptation = animeRelation.relation_data.find((rel) => rel.relation === 'Adaptation');
		const relSideStory = animeRelation.relation_data.find((rel) => rel.relation === 'Side Story');

		// 4. Get or fetch recommendation data
		let animeRecommendation = await getAnimeRecommendationByMalId(mal_id);

		if (!animeRecommendation) {
			console.log('Run fetch anime recommendation');
			const dataFromAPI = await fetchAnimeRecommendationByMalId(mal_id);
			await insertAnimeRecommendationByMalId(mal_id, dataFromAPI);
			animeRecommendation = await getAnimeRecommendationByMalId(mal_id);
		}

		// If anime recommendation is not enough, re fetch the fresh data and insert to database
		if (animeRecommendation.recommendation_data.length <= 6) {
			console.log('Not enough recommendation, re run fetch anime recommendation');
			const dataFromAPI = await fetchAnimeRecommendationByMalId(mal_id);
			await insertAnimeRecommendationByMalId(mal_id, dataFromAPI);
			animeRecommendation = await getAnimeRecommendationByMalId(mal_id);

			// If its still not enough, will fetch anime recommendation from my fav anime, but not store the list to
			if (animeRecommendation.recommendation_data.length <= 6) {
				console.log('Still not enough recommendation, fetch random anime recommendation');
				// Delay request for 1 sec
				await new Promise((resolve) => setTimeout(resolve, 1000));
				const response = await axios.get(`${API_URL}/anime/1210/recommendations`);
				const data = response.data.data.slice(0, 10);
				animeRecommendation = data;
			}
		}

		return {
			anime: animeData,
			character: animeCharacter,
			relation: {
				prequel: relPrequel,
				sequel: relSequel,
				adaptation: relAdaptation,
				side_story: relSideStory,
			},
			recommendation: animeRecommendation,
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
