import express from 'express';
import { getAnime, getAnimeById } from '../controllers/api/apiAnime';
import { getCharacterFull } from '../controllers/api/apiCharacterFull';
import { getAnimeTop } from '../controllers/api/apiGetAnimeTop.controller';
import { getAnimeTrending } from '../controllers/api/apiGetAnimeTrending.controller';
import { getMangaTop } from '../controllers/api/apiGetMangaTop.controller';
import { getManga, getMangaById } from '../controllers/api/apiManga';
import { getListEachUser } from '../controllers/api/apiUserList.controller';
import { isAuthenticated } from '../middlewares/checkAuth';

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

// * Character *
apiRoutes.get('/character/:id/full', getCharacterFull);

// * User List *
apiRoutes.get('/user/list', getListEachUser);
