import axios, { AxiosResponse } from 'axios';
import { JIKAN_BASE_URL } from '../config/env.config';
import { JikanMangaResponse, Manga } from '../types/mangaData.types';

const API_URL = JIKAN_BASE_URL;

export async function fetchTopMangaBatch(maxPage: number): Promise<Manga[]> {
	const topMangaList: Manga[] = [];
	const requestsPerSecond = 3;
	const delayMs = 3000 / requestsPerSecond;

	for (let page = 1; page <= maxPage; page++) {
		const startTime = Date.now();

		try {
			const response: AxiosResponse<JikanMangaResponse> = await axios.get(`${API_URL}/top/manga`, {
				params: { page },
				timeout: 20000, // Increased timeout for larger pages
			});

			const topMangaData: Manga[] = response.data.data;

			if (topMangaData?.length) {
				topMangaList.push(...topMangaData);
				console.log(
					`✅ Page ${page}: ${topMangaData.length} anime (Total: ${topMangaList.length})`
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

	console.log(`🎉 Fetched ${topMangaList.length} top manga from ${maxPage} pages`);
	return topMangaList;
}
