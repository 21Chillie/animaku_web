import { createTableAnime } from './animeDBCreateTable';
import { createTableTopAnime } from './animeTopCreateTable';
import { createTableTrendingAnime } from './animeTrendingCreateTable';
import { createTableTopManga } from './mangaTopCreatingTable';

async function createAllTables() {
	try {
		await createTableAnime();
		await createTableTrendingAnime();
		await createTableTopAnime();
		await createTableTopManga();

		console.log('All table created successfully');
	} catch (error) {
		console.error('Error creating tables: ', error);
		process.exit(1);
	}
}

createAllTables();
