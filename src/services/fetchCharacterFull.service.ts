import axios, { AxiosResponse } from 'axios';
import { JIKAN_BASE_URL } from '../config/env.config';
import { CharacterFull, JikanCharacterFullResponse } from '../types/characterFullData.types';
import { jikanLimiter } from '../middlewares/bottleneck';

const API_URL = JIKAN_BASE_URL;

export async function fetchCharacterFullData(mal_id: number): Promise<CharacterFull> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const response: AxiosResponse<JikanCharacterFullResponse> = await jikanLimiter.schedule(
			async () => {
				return await axios.get(`${API_URL}/characters/${mal_id}/full`, {
					timeout: 3000,
				});
			}
		);

		const data: CharacterFull = response.data.data;

		if (data) {
			console.log(`Fetch full character details with ID ${mal_id} success`);
		}

		return data;
	} catch (err) {
		if (err instanceof Error) {
			console.error('Error fetching trending anime list from api: ', err);
		}

		if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
			console.error('Request timed out, please refresh again in a second');
			throw new Error('Request timed out, please try refresh the browser in a second');
		}

		throw new Error('Something went wrong while fetching trending anime list from API!');
	}
}
