export interface DatabaseThemesResponse {
	id: number;
	mal_id: number;
	themes: AnimeThemes;
}

// Main response type
export interface JikanAnimeThemesResponse {
	data: AnimeThemes;
}

// Anime themes
export interface AnimeThemes {
	openings: string[];
	endings: string[];
}
