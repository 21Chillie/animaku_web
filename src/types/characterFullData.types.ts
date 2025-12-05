// Main response type
export interface JikanCharacterFullResponse {
	data: CharacterFull;
}

// Main response type
export interface DatabaseCharacterFullResponse {
	id: number;
	mal_id: number;
	name: string;
	data: CharacterFull;
}

// Main Character interface
export interface CharacterFull {
	mal_id: number;
	url: string;
	images: CharacterImages;
	name: string;
	name_kanji: string | null;
	nicknames: string[];
	favorites: number;
	about: string | null;
	anime: CharacterAnime[];
	manga: CharacterManga[];
	voices: VoiceActor[];
}

// Character images
export interface CharacterImages {
	jpg: CharacterImage;
	webp: CharacterImage;
}

export interface CharacterImage {
	image_url: string | null;
}

// Character anime appearances
export interface CharacterAnime {
	role: string;
	anime: AnimeAppearance;
}

export interface AnimeAppearance {
	mal_id: number;
	url: string;
	images: AnimeImages;
	title: string;
}

export interface AnimeImages {
	jpg: AnimeImage;
	webp: AnimeImage;
}

export interface AnimeImage {
	image_url: string | null;
	small_image_url: string | null;
	large_image_url: string | null;
}

// Character manga appearances
export interface CharacterManga {
	role: string;
	manga: MangaAppearance;
}

export interface MangaAppearance {
	mal_id: number;
	url: string;
	images: MangaImages;
	title: string;
}

export interface MangaImages {
	jpg: MangaImage;
	webp: MangaImage;
}

export interface MangaImage {
	image_url: string | null;
	small_image_url: string | null;
	large_image_url: string | null;
}

// Voice actors
export interface VoiceActor {
	person: Person;
	language: string;
}

export interface Person {
	mal_id: number;
	url: string;
	images: PersonImages;
	name: string;
}

export interface PersonImages {
	jpg: PersonImage;
}

export interface PersonImage {
	image_url: string | null;
}
