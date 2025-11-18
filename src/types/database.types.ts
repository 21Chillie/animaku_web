import { Anime } from './animeData.types';
import { Manga } from './mangaData.types';

export interface DatabaseAnimeTypes {
	id: number;
	mal_id: number;
	title: string;
	type: string;
	status: string;
	year: number | null;
	score: number | null;
	rank: number | null;
	popularity: number | null;
	data: Anime;
	created_at: string;
	last_updated_at: string;
}

export interface DatabaseMangaTypes {
	id: number;
	mal_id: number;
	title: string;
	type: string;
	status: string;
	year: number | null;
	score: number | null;
	rank: number | null;
	popularity: number | null;
	data: Manga;
	created_at: string;
	last_updated_at: string;
}
