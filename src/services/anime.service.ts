import axios from "axios";
import dotenv from "dotenv";
import { Anime } from "../types/animeTrendingData.types";

dotenv.config();

const API_URL = process.env.JIKAN_BASE_URL;

export async function fetchAnimeTrending(maxPage: number = 4): Promise<Anime[]> {
	const trendingAnimeList: Anime[] = [];

	// Loop request max 4 pages for fetching only 100 anime trending data
	for (let page = 1; page <= maxPage; page++) {
		try {
			// Delay Request
			if (page > 1) {
				await new Promise((resolve) => setTimeout(resolve, 200));
			}

			const response = await axios.get(`${API_URL}/seasons/now`, {
				params: {
					page: page,
				},
				timeout: 10000,
			});
			const animeTrendingData: Anime[] = response.data.data;

			// If the data is available and the data is array then push
			if (animeTrendingData && Array.isArray(animeTrendingData)) {
				trendingAnimeList.push(...animeTrendingData);

				console.log(`Page ${page}: ${trendingAnimeList.length} anime titles fetched from API`);
			}

			// Stop early if no more pages available
			if (!response.data.pagination.has_next_page) {
				console.log(`⏹️ No more pages available. Stopping at page ${page}`);
				break;
			}
		} catch (err) {
			if (err instanceof Error) {
				console.error("Error fetching trending anime list from api: ", err);
			}

			if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
				console.error("Request timed out");
			}

			throw new Error("Something went wrong while fetching trending anime list from API!");
		}
	}

	return trendingAnimeList;
}
