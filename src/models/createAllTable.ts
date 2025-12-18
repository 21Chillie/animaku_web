import { createTableAnime } from './anime/animeDBCreateTable';
import { createTableAnimeTheme } from './anime/animeThemesCreateTable';
import { createTableTopAnime } from './anime/animeTopCreateTable';
import { createTableTrendingAnime } from './anime/animeTrendingCreateTable';
import { createTableCharacterFull } from './character/characterFullCreateTable';
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
import { createUserTable } from './user/userCreateTable';
import { createUserListTable } from './user/userListCreateTable';

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
		await createTableCharacterFull();
		await createUserTable();
		await createUserListTable();

		console.log('All table created successfully');
	} catch (error) {
		console.error('Error creating tables: ', error);
		process.exit(1);
	}
}

createAllTables();
