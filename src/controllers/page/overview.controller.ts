import axios from 'axios';
import type { Request, Response } from 'express';
import { JIKAN_BASE_URL } from '../../config/env.config';
import { getAnimeByMalId, insertAnimeDataByMalId } from '../../models/anime/animeDBModel';
import {
	getAnimeThemesByMalId,
	insertAnimeThemesByMalId,
} from '../../models/anime/animeTheme.models';
import { getMangaByMalId, insertMangaDataByMalId } from '../../models/manga/mangaDB.model';
import {
	getAnimeCharactersByMalId,
	getMangaCharactersByMalId,
	insertAnimeCharacterByMalId,
	insertMangaCharacterByMalId,
} from '../../models/other/character.model';
import {
	getAnimeRecommendationByMalId,
	getMangaRecommendationByMalId,
	insertAnimeRecommendationByMalId,
	insertMangaRecommendationByMalId,
} from '../../models/other/recommendation.model';
import {
	getAnimeRelationByMalId,
	getMangaRelationByMalId,
	insertAnimeRelationByMalId,
	insertMangaRelationByMalId,
} from '../../models/other/relation.model';
import {
	fetchAnimeByMalId,
	fetchAnimeCharactersByMalId,
	fetchAnimeRecommendationByMalId,
	fetchAnimeRelationByMalId,
	fetchAnimeThemeByMalId,
	fetchMangaByMalId,
	fetchMangaCharactersByMalId,
	fetchMangaRecommendationByMalId,
	fetchMangaRelationByMalId,
} from '../../services/fetchTitleData';
import { parseSynopsis, parseThemeString } from '../../utils/parseData.utils';

const API_URL = JIKAN_BASE_URL;

async function getAnimeData(mal_id: number) {
	try {
		// 1. Get or fetch anime data
		let animeData = await getAnimeByMalId(mal_id);

		if (!animeData) {
			await new Promise((resolve) => setTimeout(resolve, 350));
			console.log('Run fetch anime');
			const dataFromAPI = await fetchAnimeByMalId(mal_id);
			await insertAnimeDataByMalId(dataFromAPI);
			animeData = await getAnimeByMalId(mal_id);
		}

		const synopsis = parseSynopsis(animeData.data.synopsis);

		// 2. Get or fetch character data
		let animeCharacter = await getAnimeCharactersByMalId(mal_id);

		if (!animeCharacter) {
			await new Promise((resolve) => setTimeout(resolve, 350));
			console.log('Run fetch anime character');
			const dataFromAPI = await fetchAnimeCharactersByMalId(mal_id);
			await insertAnimeCharacterByMalId(mal_id, dataFromAPI);
			animeCharacter = await getAnimeCharactersByMalId(mal_id);
		}

		// 3. Get or fetch relation data
		let animeRelation = await getAnimeRelationByMalId(mal_id);

		if (!animeRelation) {
			await new Promise((resolve) => setTimeout(resolve, 350));
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
			await new Promise((resolve) => setTimeout(resolve, 350));
			console.log('Run fetch anime recommendation');
			const dataFromAPI = await fetchAnimeRecommendationByMalId(mal_id);
			await insertAnimeRecommendationByMalId(mal_id, dataFromAPI);
			animeRecommendation = await getAnimeRecommendationByMalId(mal_id);
		}

		// If anime recommendation is not enough, re fetch the fresh data and insert to database
		if (animeRecommendation.recommendation_data.length <= 6) {
			await new Promise((resolve) => setTimeout(resolve, 350));
			console.log('Not enough recommendation, re run fetch anime recommendation');
			const dataFromAPI = await fetchAnimeRecommendationByMalId(mal_id);
			await insertAnimeRecommendationByMalId(mal_id, dataFromAPI);
			animeRecommendation = await getAnimeRecommendationByMalId(mal_id);

			// If its still not enough, will fetch anime recommendation from my fav anime, but not store the list to
			if (animeRecommendation.recommendation_data.length <= 6) {
				console.log('Still not enough recommendation, fetch random anime recommendation');
				// Delay request for 500ms
				await new Promise((resolve) => setTimeout(resolve, 350));
				const response = await axios.get(`${API_URL}/anime/1210/recommendations`);
				const data = response.data.data.slice(0, 10);
				animeRecommendation.recommendation_data = data;
			}
		}

		// Get Anime theme
		let animeTheme = await getAnimeThemesByMalId(mal_id);

		// if no anime theme store in database, then fetch from api and store it to database
		if (!animeTheme) {
			await new Promise((resolve) => setTimeout(resolve, 350));
			console.log('Run fetch anime theme');
			const dataFromAPI = await fetchAnimeThemeByMalId(mal_id);
			await insertAnimeThemesByMalId(mal_id, dataFromAPI);
			animeTheme = await getAnimeThemesByMalId(mal_id);
		}

		const parsedOpenings = animeTheme.themes.openings.map(parseThemeString);
		const parsedEndings = animeTheme.themes.endings.map(parseThemeString);

		return {
			anime: animeData,
			synopsis: synopsis,
			character: animeCharacter,
			relation: {
				prequel: relPrequel,
				sequel: relSequel,
				adaptation: relAdaptation,
				side_story: relSideStory,
			},
			recommendation: animeRecommendation,
			themes: {
				opening: parsedOpenings,
				ending: parsedEndings,
			},
		};
	} catch (err) {
		console.error('Error in getAnimeData:', err);
		throw err; // Re-throw to let caller handle it
	}
}

async function getMangaData(mal_id: number) {
	try {
		// 1. Get or fetch manga data
		let mangaData = await getMangaByMalId(mal_id);

		if (!mangaData) {
			console.log('Run fetch manga');
			const dataFromAPI = await fetchMangaByMalId(mal_id);
			await insertMangaDataByMalId(dataFromAPI);
			mangaData = await getMangaByMalId(mal_id);
			await new Promise((resolve) => setTimeout(resolve, 350));
		}

		const synopsis = parseSynopsis(mangaData.data.synopsis);

		// 2. Get or fetch manga character data
		let mangaCharacter = await getMangaCharactersByMalId(mal_id);

		if (!mangaCharacter) {
			console.log('Run fetch manga character');
			const dataFromAPI = await fetchMangaCharactersByMalId(mal_id);
			await insertMangaCharacterByMalId(mal_id, dataFromAPI);
			mangaCharacter = await getMangaCharactersByMalId(mal_id);
			await new Promise((resolve) => setTimeout(resolve, 350));
		}

		// 3 Get or fetch manga relation data
		let mangaRelation = await getMangaRelationByMalId(mal_id);

		if (!mangaRelation) {
			console.log('Run fetch anime relation');
			const dataFromAPI = await fetchMangaRelationByMalId(mal_id);
			await insertMangaRelationByMalId(mal_id, dataFromAPI);
			mangaRelation = await getMangaRelationByMalId(mal_id);
			await new Promise((resolve) => setTimeout(resolve, 350));
		}

		const relPrequel = mangaRelation.relation_data.find((rel) => rel.relation === 'Prequel');
		const relSequel = mangaRelation.relation_data.find((rel) => rel.relation === 'Sequel');
		const relAdaptation = mangaRelation.relation_data.find((rel) => rel.relation === 'Adaptation');
		const relSideStory = mangaRelation.relation_data.find((rel) => rel.relation === 'Side Story');

		// 4. Get or fetch manga recommendation data
		let mangaRecommendation = await getMangaRecommendationByMalId(mal_id);

		if (!mangaRecommendation) {
			console.log('Run fetch manga recommendation');
			const dataFromAPI = await fetchMangaRecommendationByMalId(mal_id);
			await insertMangaRecommendationByMalId(mal_id, dataFromAPI);
			mangaRecommendation = await getMangaRecommendationByMalId(mal_id);
			await new Promise((resolve) => setTimeout(resolve, 350));
		}

		if (mangaRecommendation.recommendation_data.length <= 6) {
			console.log('Not enough recommendation, re run fetch manga recommendation');
			const dataFromAPI = await fetchMangaRecommendationByMalId(mal_id);
			await insertMangaRecommendationByMalId(mal_id, dataFromAPI);
			mangaRecommendation = await getMangaRecommendationByMalId(mal_id);
			await new Promise((resolve) => setTimeout(resolve, 350));

			if (mangaRecommendation.recommendation_data.length <= 6) {
				console.log('Still not enough recommendation, fetch random manga recommendation');
				await new Promise((resolve) => setTimeout(resolve, 350));
				const response = await axios.get(`${API_URL}/manga/24705/recommendations`);
				const data = response.data.data.slice(0, 10);
				mangaRecommendation.recommendation_data = data;
			}
		}

		return {
			manga: mangaData,
			synopsis: synopsis,
			character: mangaCharacter,
			relation: {
				prequel: relPrequel,
				sequel: relSequel,
				adaptation: relAdaptation,
				side_story: relSideStory,
			},
			recommendation: mangaRecommendation,
		};
	} catch (err) {
		console.error('Error in getAnimeData:', err);
		throw err; // Re-throw to let caller handle it
	}
}

export async function renderOverview(req: Request, res: Response) {
	const id = parseInt(req.params.id);
	const type = req.params.type;

	if (type === 'anime') {
		const data = await getAnimeData(id);
		// return res.status(200).json({ type, data });
		return res.status(200).render('overview', { type, data });
	}

	if (type === 'manga') {
		const data = await getMangaData(id);
		// return res.status(200).json({ type, data });
		return res.status(200).render('overview', { type, data });
	}
}
