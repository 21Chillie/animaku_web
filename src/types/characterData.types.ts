// Database Response
export interface DatabaseCharacterResponse {
	id: number;
	mal_id: number;
	character_data: JikanCharacter[];
}

// Main response type
export interface JikanCharactersResponse {
	data: JikanCharacter[];
}

// Then the main interface would be:
export interface JikanCharacter {
	character: CharacterBasicInfo;
	role: string;
	voice_actors?: VoiceActor[];
	favorites?: number;
}

// Individual character type
export interface Character {
	character: {
		mal_id: number;
		url: string;
		images: {
			jpg: {
				image_url: string;
				small_image_url?: string;
			};
			webp: {
				image_url: string;
				small_image_url?: string;
			};
		};
		name: string;
	};
	role: string;
	voice_actors?: Array<{
		// Only present in anime response
		person: {
			mal_id: number;
			url: string;
			images: {
				jpg: {
					image_url: string;
				};
			};
			name: string;
		};
		language: string;
	}>;
	favorites?: number;
}

// You can also create more granular types if needed:
export interface CharacterBasicInfo {
	mal_id: number;
	url: string;
	images: {
		jpg: {
			image_url: string;
			small_image_url?: string;
		};
		webp: {
			image_url: string;
			small_image_url?: string;
		};
	};
	name: string;
}

export interface VoiceActor {
	person: {
		mal_id: number;
		url: string;
		images: {
			jpg: {
				image_url: string;
			};
		};
		name: string;
	};
	language: string;
}
