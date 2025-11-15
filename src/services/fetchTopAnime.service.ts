import axios, { type AxiosResponse } from 'axios';
import { JIKAN_BASE_URL } from '../config/env.config';
import type { Anime, JikanResponse } from '../types/animeData.types';

const API_URL = JIKAN_BASE_URL;

export async function fetchTopAnimeBatch(maxPage: number): Promise<Anime[]> {
	const topAnimeList: Anime[] = [];

	// Loop request max 4 pages for fetching only 100 anime trending data
	for (let page = 1; page <= maxPage; page++) {
		try {
			// Delay Request
			if (page > 1) {
				await new Promise((resolve) => setTimeout(resolve, 335));
			}

			const response: AxiosResponse<JikanResponse> = await axios.get(`${API_URL}/top/anime`, {
				params: {
					page: page,
				},
				timeout: 10000,
			});
			const topAnimeData: Anime[] = response.data.data;

			// If the data is available and the data is array then push
			if (topAnimeData && Array.isArray(topAnimeData)) {
				topAnimeList.push(...topAnimeData);

				console.log(`Page ${page}: ${topAnimeList.length} top anime titles fetched from API`);
			}

			// Stop early if no more pages available
			if (!response.data.pagination.has_next_page) {
				console.log(`⏹️ No more pages available. Stopping at page ${page}`);
				break;
			}
		} catch (err) {
			if (err instanceof Error) {
				console.error('Error fetching top anime list from api: ', err);
			}

			if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
				console.error('Request timed out');
			}

			throw new Error('Something went wrong while fetching topanime list from API!');
		}
	}

	return topAnimeList;
}
