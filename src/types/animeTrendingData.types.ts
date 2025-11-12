// Main response type
export interface JikanResponse {
	data: Anime[];
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

// Main Anime interface
export interface Anime {
	mal_id: number;
	url: string;
	images: ImageSet;
	trailer: Trailer;
	approved: boolean;
	titles: Title[];
	title: string;
	title_english: string | null;
	title_japanese: string | null;
	title_synonyms: string[];
	type: string;
	source: string;
	episodes: number | null;
	status: string;
	airing: boolean;
	aired: Aired;
	duration: string;
	rating: string | null;
	score: number | null;
	scored_by: number | null;
	rank: number | null;
	popularity: number | null;
	members: number | null;
	favorites: number | null;
	synopsis: string | null;
	background: string | null;
	season: string | null;
	year: number | null;
	broadcast: Broadcast;
	producers: Demographic[];
	licensors: Demographic[];
	studios: Demographic[];
	genres: Demographic[];
	explicit_genres: Demographic[];
	themes: Demographic[];
	demographics: Demographic[];
}

// Image types
export interface ImageSet {
	jpg: ImageUrls;
	webp: ImageUrls;
}

export interface ImageUrls {
	image_url: string | null;
	small_image_url: string | null;
	large_image_url: string | null;
}

// Trailer
export interface Trailer {
	youtube_id: string | null;
	url: string | null;
	embed_url: string | null;
	images: TrailerImages;
}

export interface TrailerImages {
	image_url: string | null;
	small_image_url: string | null;
	medium_image_url: string | null;
	large_image_url: string | null;
	maximum_image_url: string | null;
}

// Title
export interface Title {
	type: string;
	title: string;
}

// Aired dates
export interface Aired {
	from: string | null;
	to: string | null;
	prop: AiredProp;
	string: string;
}

export interface AiredProp {
	from: DateProp;
	to: DateProp;
}

export interface DateProp {
	day: number | null;
	month: number | null;
	year: number | null;
}

// Broadcast
export interface Broadcast {
	day: string | null;
	time: string | null;
	timezone: string | null;
	string: string | null;
}

// Demographic/Genre/Producer/Studio etc.
export interface Demographic {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}
