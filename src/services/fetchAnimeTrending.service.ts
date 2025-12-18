import axios, { type AxiosResponse } from 'axios';
import { JIKAN_BASE_URL } from '../config/env.config';
import type { Anime, JikanResponse } from '../types/animeData.types';
import { jikanLimiter } from '../middlewares/bottleneck';

const API_URL = JIKAN_BASE_URL;

export async function fetchAnimeTrendingLimit(maxRecords: number): Promise<Anime[]> {
	const data: Anime[] = [];

	try {
		const response: AxiosResponse<JikanResponse> = await jikanLimiter.schedule(async () => {
			return await axios.get(`${API_URL}/seasons/now`, {
				params: {
					limit: maxRecords,
					continuing: true,
				},
				timeout: 10000,
			});
		});

		const result: Anime[] = response.data.data;

		if (result && Array.isArray(result)) {
			data.push(...result.slice(0, maxRecords));
			console.log(`Successfully fetched ${result.length} trending anime titles from API`);
		}
	} catch (err) {
		if (err instanceof Error) {
			console.error('Error fetching trending anime list from api: ', err);
		}

		if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
			console.error('Request timed out');
		}

		throw new Error('Something went wrong while fetching trending anime list from API!');
	}

	return data;
}

// export async function fetchAnimeTrendingBatch(maxPage: number): Promise<Anime[]> {
// 	const trendingAnimeList: Anime[] = [];
// 	const requestsPerSecond = 3;
// 	const delayMs = 3000 / requestsPerSecond;

// 	for (let page = 1; page <= maxPage; page++) {
// 		const startTime = Date.now();

// 		try {
// 			const response: AxiosResponse<JikanResponse> = await axios.get(`${API_URL}/seasons/now`, {
// 				params: {
// 					page,
// 					continuing: true,
// 				},
// 				timeout: 20000, // Increased timeout for larger pages
// 			});

// 			const trendingAnimeData: Anime[] = response.data.data;

// 			if (trendingAnimeData?.length) {
// 				trendingAnimeList.push(...trendingAnimeData);
// 				console.log(
// 					`✅ Page ${page}: ${trendingAnimeData.length} anime (Total: ${trendingAnimeList.length})`
// 				);
// 			}

// 			if (!response.data.pagination.has_next_page) {
// 				console.log(`⏹️ No more pages. Stopping at page ${page}`);
// 				break;
// 			}
// 		} catch (err) {
// 			console.error(`❌ Page ${page} failed:`, err instanceof Error ? err.message : err);

// 			// If it's a rate limit error, wait longer
// 			if (axios.isAxiosError(err) && err.response?.status === 429) {
// 				console.log('⚠️ Rate limited, waiting 5 seconds...');
// 				await new Promise((resolve) => setTimeout(resolve, 5000));
// 			}
// 			continue;
// 		}

// 		// Ensure minimum delay between requests
// 		const elapsed = Date.now() - startTime;
// 		if (elapsed < delayMs && page < maxPage) {
// 			await new Promise((resolve) => setTimeout(resolve, delayMs - elapsed));
// 		}
// 	}

// 	console.log(`🎉 Fetched ${trendingAnimeList.length} trending anime from ${maxPage} pages`);
// 	return trendingAnimeList;
// }

export async function fetchAnimeTrendingBatch(maxPage: number): Promise<Anime[]> {
	const trendingAnimeList: Anime[] = [];

	for (let page = 1; page <= maxPage; page++) {
		try {
			const response: AxiosResponse<JikanResponse> = await jikanLimiter.schedule(() =>
				axios.get(`${API_URL}/seasons/now`, {
					params: {
						page,
						continuing: true,
					},
					timeout: 20000,
				})
			);

			const trendingAnimeData: Anime[] = response.data.data;

			if (trendingAnimeData?.length) {
				trendingAnimeList.push(...trendingAnimeData);
				console.log(
					`✅ Page ${page}: ${trendingAnimeData.length} anime (Total: ${trendingAnimeList.length})`
				);
			}

			if (!response.data.pagination.has_next_page) {
				console.log(`⏹️ No more pages. Stopping at page ${page}`);
				break;
			}
		} catch (err) {
			console.error(`❌ Page ${page} failed:`, err instanceof Error ? err.message : err);

			// Bottleneck already handles pacing; just continue
			if (axios.isAxiosError(err) && err.response?.status === 429) {
				console.warn('⚠️ Rate limit hit (unexpected with limiter)');
			}
			continue;
		}
	}

	console.log(`🎉 Fetched ${trendingAnimeList.length} trending anime from ${maxPage} pages`);
	return trendingAnimeList;
}
