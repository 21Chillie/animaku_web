import { createTableAnime } from './anime/animeDBCreateTable';
import { createTableAnimeTheme } from './anime/animeThemesCreateTable';
import { createTableTopAnime } from './anime/animeTopCreateTable';
import { createTableTrendingAnime } from './anime/animeTrendingCreateTable';
import { createTableManga } from './manga/mangaDBCreateTable';
import { createTableTopManga } from './manga/mangaTopCreatingTable';
import {
	createTableAnimeCharacter,
	createTableMangaCharacter,
} from './other/characterDBCreateTable';
import {
	createTableAnimeRecommendation,
	createTableMangaRecommendation,
} from './other/recommendationDBCreateTable';
import { createTableAnimeRelation, createTableMangaRelation } from './other/relationDBCreateTable';

async function createAllTables() {
	try {
		await createTableAnime();
		await createTableManga();
		await createTableTrendingAnime();
		await createTableTopAnime();
		await createTableTopManga();
		await createTableAnimeCharacter();
		await createTableMangaCharacter();
		await createTableAnimeRelation();
		await createTableMangaRelation();
		await createTableAnimeRecommendation();
		await createTableMangaRecommendation();
		await createTableAnimeTheme();

		console.log('All table created successfully');
	} catch (error) {
		console.error('Error creating tables: ', error);
		process.exit(1);
	}
}

createAllTables();
