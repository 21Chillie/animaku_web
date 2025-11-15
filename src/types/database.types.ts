import { Anime } from './animeData.types';
import { Manga } from './mangaData.types';

export interface DatabaseAnimeTypes {
	id: number;
	mal_id: number;
	data: Anime;
	title: string;
	score: number | null;
	type: string;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface DatabaseMangaTypes {
	id: number;
	mal_id: number;
	data: Manga;
	title: string;
	score: number | null;
	type: string;
	status: string;
	created_at: string;
	updated_at: string;
}
