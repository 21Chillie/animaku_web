export interface User {
	id: string;
	email?: string | null;
	password_hash?: string | null;
	google_id?: string | null;
	username: string;
	avatar_url?: string | null;
	is_email_verified: boolean;
	created_at: string;
	updated_at: string;
}

// Enum User list status
export type UserListStatus =
	| 'watching'
	| 'reading'
	| 'plan_read'
	| 'plan_watch'
	| 'completed'
	| 'paused'
	| 'dropped';

// ENUM Media type
export type MediaType = 'anime' | 'manga';

// Database Result Type
export interface UserList {
	id: number; // SERIAL PRIMARY KEY
	user_id: string; // UUID
	media_mal_id: number; // INTEGER
	media_type: MediaType; // 'anime' | 'manga'

	status: UserListStatus; // status enum above
	score: number | null; // INTEGER CHECK 0-10

	progress_episodes: number; // INTEGER
	progress_chapters: number; // INTEGER
	progress_volumes: number; // INTEGER

	start_date: Date | null;
	finish_date: Date | null;

	notes: string | null;

	created_at: Date;
	updated_at: Date;
}

export interface findUserListType {
	userId: string | null;
	mediaMalId: number;
	mediaType: MediaType;
}

export interface AddListType {
	userId: string | null;
	mediaMalId: number;
	mediaType: MediaType;
	status: UserListStatus;

	score?: number | null;
	progressEpisodes?: number;
	progressChapters?: number;
	progressVolumes?: number;

	startDate?: Date | null;
	finishDate?: Date | null;

	notes?: string | null;
}

export interface UpdateListType {
	status?: UserListStatus;
	score?: number | null;

	progressEpisodes?: number;
	progressChapters?: number;
	progressVolumes?: number;

	startDate?: Date | null;
	finishDate?: Date | null;

	notes?: string | null;
}

export interface DeleteListType {
	userId: string | null;
	mediaMalId: number;
	mediaType: MediaType;
}

// REQUEST BODY TYPE
export interface AddListRequestBody {
	userId: string;
	inputMalId: string;
	inputType: MediaType;

	selectStatus: UserListStatus;

	inputScore?: string | null;
	inputEpisode?: string;
	inputChapter?: string;
	inputVolume?: string;

	inputStartDate?: string | null;
	inputFinishDate?: string | null;

	inputNotes?: string | null;
}

export interface DeleteListRequestBody {
	deleteListMalId: string;
	deleteListMediaType: MediaType;
}
