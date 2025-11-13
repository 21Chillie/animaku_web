import { Anime } from "./animeData.types";

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
