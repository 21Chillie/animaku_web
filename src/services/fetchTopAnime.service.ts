import axios, { type AxiosResponse } from 'axios';
import { JIKAN_BASE_URL } from '../config/env.config';
import type { Anime, JikanResponse } from '../types/animeData.types';

const API_URL = JIKAN_BASE_URL;

export async function fetchTopAnimeBatch(maxPage: number = 20): Promise<Anime[]> {
	const topAnimeList: Anime[] = [];
	const requestsPerSecond = 3;
	const delayMs = 3000 / requestsPerSecond;

	for (let page = 1; page <= maxPage; page++) {
		const startTime = Date.now();

		try {
			const response: AxiosResponse<JikanResponse> = await axios.get(`${API_URL}/top/anime`, {
				params: { page },
				timeout: 20000, // Increased timeout for larger pages
			});

			const topAnimeData: Anime[] = response.data.data;

			if (topAnimeData?.length) {
				topAnimeList.push(...topAnimeData);
				console.log(
					`✅ Page ${page}: ${topAnimeData.length} anime (Total: ${topAnimeList.length})`
				);
			}

			if (!response.data.pagination.has_next_page) {
				console.log(`⏹️ No more pages. Stopping at page ${page}`);
				break;
			}
		} catch (err) {
			console.error(`❌ Page ${page} failed:`, err instanceof Error ? err.message : err);

			// If it's a rate limit error, wait longer
			if (axios.isAxiosError(err) && err.response?.status === 429) {
				console.log('⚠️ Rate limited, waiting 5 seconds...');
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
			continue;
		}

		// Ensure minimum delay between requests
		const elapsed = Date.now() - startTime;
		if (elapsed < delayMs && page < maxPage) {
			await new Promise((resolve) => setTimeout(resolve, delayMs - elapsed));
		}
	}

	console.log(`🎉 Fetched ${topAnimeList.length} top anime from ${maxPage} pages`);
	return topAnimeList;
}
