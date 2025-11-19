export interface DatabaseRecommendationResponse {
	id: number;
	mal_id: number;
	recommendation_data: Recommendation[];
}

// Main response type - works for both anime and manga
export interface JikanRecommendationsResponse {
	data: Recommendation[];
}

// Simple recommendation type
export interface Recommendation {
	entry: {
		mal_id: number;
		url: string;
		images: {
			jpg: {
				image_url: string;
				small_image_url: string;
				large_image_url: string;
			};
			webp: {
				image_url: string;
				small_image_url: string;
				large_image_url: string;
			};
		};
		title: string;
	};
	votes: number;
}
