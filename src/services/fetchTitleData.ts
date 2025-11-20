import axios, { AxiosResponse } from 'axios';
import { JIKAN_BASE_URL } from '../config/env.config';
import { Anime, JikanResponseAnimeDataById } from '../types/animeData.types';
import { JikanCharacter, JikanCharactersResponse } from '../types/characterData.types';
import { JikanResponseMangaDataById, Manga } from '../types/mangaData.types';
import { JikanRecommendationsResponse, Recommendation } from '../types/recommendationData.types';
import { JikanRelationsResponse, Relation } from '../types/relationData.types';

const API_URL = JIKAN_BASE_URL;

// Fetch Anime by mal Id
export async function fetchAnimeByMalId(mal_id: number): Promise<Anime> {
	try {
		const response: AxiosResponse<JikanResponseAnimeDataById> = await axios.get(
			`${API_URL}/anime/${mal_id}/`
		);

		const data: Anime = response.data.data;

		if (data) {
			console.log('Successfully fetch anime data from api');
		}

		return data;
	} catch (err) {
		console.error(`Something went wrong while trying fetch anime data with id `, mal_id);

		if (axios.isAxiosError(err) && err.response?.status === 429) {
			console.error('Rate limited, please wait in a second and try refresh browser');
		}

		throw new Error('Something went wrong while trying fetch anime data');
	}
}

// Fetch anime character by mal id
export async function fetchAnimeCharactersByMalId(mal_id: number): Promise<JikanCharacter[]> {
	try {
		const response: AxiosResponse<JikanCharactersResponse> = await axios.get(
			`${API_URL}/anime/${mal_id}/characters/`
		);

		const data: JikanCharacter[] = response.data.data;

		if (data) {
			console.log('Successfully fetch anime characters data from api');
		}

		return data.slice(0, 10);
	} catch (err) {
		console.error(`Something went wrong while trying fetch anime characters data with id `, mal_id);

		if (axios.isAxiosError(err) && err.response?.status === 429) {
			console.error('Rate limited, please wait in a second and try refresh browser');
		}

		throw new Error('Something went wrong while trying fetch anime characters data');
	}
}

// Fetch anime relation by mal id
export async function fetchAnimeRelationByMalId(mal_id: number): Promise<Relation[]> {
	try {
		const response: AxiosResponse<JikanRelationsResponse> = await axios.get(
			`${API_URL}/anime/${mal_id}/relations`
		);

		const data: Relation[] = response.data.data;

		if (data) {
			console.log('Successfully fetch anime relations data from api');
		}

		return data;
	} catch (err) {
		console.error(`Something went wrong while trying fetch anime relations data with id `, mal_id);

		if (axios.isAxiosError(err) && err.response?.status === 429) {
			console.error('Rate limited, please wait in a second and try refresh browser');
		}

		throw new Error('Something went wrong while trying fetch anime relation data');
	}
}

// Fetch anime recommendation by mal id
export async function fetchAnimeRecommendationByMalId(mal_id: number): Promise<Recommendation[]> {
	try {
		const response: AxiosResponse<JikanRecommendationsResponse> = await axios.get(
			`${API_URL}/anime/${mal_id}/recommendations`
		);

		const data = response.data.data;

		if (data) {
			console.log('Sucessfully fetch anime recommendation data from api');
		}

		return data.slice(0, 10);
	} catch (err) {
		console.error(
			`Something went wrong while trying fetch anime recommendations data with id `,
			mal_id
		);

		if (axios.isAxiosError(err) && err.response?.status === 429) {
			console.error('Rate limited, please wait in a second and try refresh browser');
		}

		throw new Error('Something went wrong while trying fetch anime recommendations data');
	}
}

// Fetch Manga by mal id
export async function fetchMangaByMalId(mal_id: number): Promise<Manga> {
	try {
		const response: AxiosResponse<JikanResponseMangaDataById> = await axios.get(
			`${API_URL}/manga/${mal_id}/`
		);

		const data: Manga = response.data.data;

		if (data) {
			console.log('Successfully fetch anime data from api');
		}

		return data;
	} catch (err) {
		console.error(`Something went wrong while trying fetch manga data with id `, mal_id);

		if (axios.isAxiosError(err) && err.response?.status === 429) {
			console.error('Rate limited, please wait in a second and try refresh browser');
		}

		throw new Error('Something went wrong while trying fetch manga data');
	}
}

// Fetch manga character by mal id
export async function fetchMangaCharactersByMalId(mal_id: number): Promise<JikanCharacter[]> {
	try {
		const response: AxiosResponse<JikanCharactersResponse> = await axios.get(
			`${API_URL}/manga/${mal_id}/characters/`
		);

		const data: JikanCharacter[] = response.data.data;

		if (data) {
			console.log('Successfully fetch manga characters data from api');
		}

		return data.slice(0, 10);
	} catch (err) {
		console.error(`Something went wrong while trying fetch manga characters data with id `, mal_id);

		if (axios.isAxiosError(err) && err.response?.status === 429) {
			console.error('Rate limited, please wait in a second and try refresh browser');
		}

		throw new Error('Something went wrong while trying fetch manga characters data');
	}
}

// Fetch manga relation by mal id
export async function fetchMangaRelationByMalId(mal_id: number): Promise<Relation[]> {
	try {
		const response: AxiosResponse<JikanRelationsResponse> = await axios.get(
			`${API_URL}/manga/${mal_id}/relations`
		);

		const data: Relation[] = response.data.data;

		if (data) {
			console.log('Successfully fetch manga relations data from api');
		}

		return data;
	} catch (err) {
		console.error(`Something went wrong while trying fetch manga relations data with id `, mal_id);

		if (axios.isAxiosError(err) && err.response?.status === 429) {
			console.error('Rate limited, please wait in a second and try refresh browser');
		}

		throw new Error('Something went wrong while trying fetch manga relation data');
	}
}

// Fetch manga recommendation by mal id
export async function fetchMangaRecommendationByMalId(mal_id: number): Promise<Recommendation[]> {
	try {
		const response: AxiosResponse<JikanRecommendationsResponse> = await axios.get(
			`${API_URL}/manga/${mal_id}/recommendations`
		);

		const data = response.data.data;

		if (data) {
			console.log('Successfully fetch manga recommendation data from api');
		}

		return data.slice(0, 10);
	} catch (err) {
		console.error(
			`Something went wrong while trying fetch manga recommendations data with id `,
			mal_id
		);

		if (axios.isAxiosError(err) && err.response?.status === 429) {
			console.error('Rate limited, please wait in a second and try refresh browser');
		}

		throw new Error('Something went wrong while trying fetch manga recommendations data');
	}
}
