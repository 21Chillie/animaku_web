import axios, { AxiosResponse } from 'axios';
import { JIKAN_BASE_URL } from '../config/env.config';
import { JikanMangaResponse, Manga } from '../types/mangaData.types';

const API_URL = JIKAN_BASE_URL;

export async function fetchTopMangaBatch(maxPage: number) {
	const topMangaList: Manga[] = [];

	for (let page = 1; page <= maxPage; page++) {
		try {
			if (page > 1) {
				await new Promise((resolve) => setTimeout(resolve, 335));
			}

			const response: AxiosResponse<JikanMangaResponse> = await axios.get(`${API_URL}/top/manga`, {
				params: {
					page: page,
				},
				timeout: 10000,
			});

			const topMangaData: Manga[] = response.data.data;

			if (topMangaData && Array.isArray(topMangaData)) {
				topMangaList.push(...topMangaData);

				console.log(`Page ${page}: ${topMangaList.length} top titles titles fetched from API`);
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

	return topMangaList;
}
