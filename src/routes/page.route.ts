import express from 'express';
import { renderCharacter } from '../controllers/page/character.controller';
import { renderIndex } from '../controllers/page/index.controller';
import { top100Anime } from '../controllers/page/list.controrller';
import { renderOverview } from '../controllers/page/overview.controller';

export const pageRoute = express.Router();

// Index route
pageRoute.get('/', renderIndex);

// Overview Character
pageRoute.get('/overview/character/:id', renderCharacter);

// Overview route
pageRoute.get('/overview/:type/:id', renderOverview);

// Trending and Top Title List
pageRoute.get('/list/:type/:category', top100Anime);
