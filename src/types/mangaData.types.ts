// Main response type
export interface JikanMangaResponse {
	data: Manga[];
	pagination: Pagination;
}

// Pagination info
export interface Pagination {
	last_visible_page: number;
	has_next_page: boolean;
	current_page: number;
	items: {
		count: number;
		total: number;
		per_page: number;
	};
}

// Main Manga interface
export interface Manga {
	mal_id: number;
	url: string;
	images: ImageSet;
	approved: boolean;
	titles: Title[];
	title: string;
	title_english: string | null;
	title_japanese: string | null;
	title_synonyms: string[];
	type: string;
	chapters: number | null;
	volumes: number | null;
	status: string;
	publishing: boolean;
	published: PublishedDate;
	score: number | null;
	scored_by: number | null;
	rank: number | null;
	popularity: number | null;
	members: number | null;
	favorites: number | null;
	synopsis: string | null;
	background: string | null;
	authors: Author[];
	serializations: Demographic[];
	genres: Demographic[];
	explicit_genres: Demographic[];
	themes: Demographic[];
	demographics: Demographic[];
}

// Image types (same as anime)
export interface ImageSet {
	jpg: ImageUrls;
	webp: ImageUrls;
}

export interface ImageUrls {
	image_url: string | null;
	small_image_url: string | null;
	large_image_url: string | null;
}

// Title
export interface Title {
	type: string;
	title: string;
}

// Published dates
export interface PublishedDate {
	from: string | null;
	to: string | null;
	prop: PublishedProp;
	string: string;
}

export interface PublishedProp {
	from: DateProp;
	to: DateProp;
}

export interface DateProp {
	day: number | null;
	month: number | null;
	year: number | null;
}

// Author information
export interface Author {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

// Demographic/Genre/Serialization etc.
export interface Demographic {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}
