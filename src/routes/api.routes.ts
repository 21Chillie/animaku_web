import express from 'express';
import { getAnime, getAnimeById } from '../controllers/apiAnime';
import { getAnimeTop } from '../controllers/apiGetAnimeTop.controller';
import { getAnimeTrending } from '../controllers/apiGetAnimeTrending.controller';
import { getMangaTop } from '../controllers/apiGetMangaTop.controller';
import { getManga, getMangaById } from '../controllers/apiManga';

export const apiRoutes = express.Router();

// * Anime *
apiRoutes.get('/anime', getAnime);
apiRoutes.get('/anime/:id', getAnimeById);
apiRoutes.get('/trending/anime', getAnimeTrending);
apiRoutes.get('/top/anime', getAnimeTop);

// * Manga *
apiRoutes.get('/manga', getManga);
apiRoutes.get('/manga/:id', getMangaById);
apiRoutes.get('/top/manga', getMangaTop);
