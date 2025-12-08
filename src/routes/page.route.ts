import express from 'express';
import { renderBrowse } from '../controllers/page/browse.controller';
import { renderCharacter } from '../controllers/page/character.controller';
import { renderIndex } from '../controllers/page/index.controller';
import { renderListTitle } from '../controllers/page/list.controller';
import { renderOverview } from '../controllers/page/overview.controller';

export const pageRoute = express.Router();

// Index route
pageRoute.get('/', renderIndex);

// Overview Character
pageRoute.get('/overview/character/:id', renderCharacter);

// Overview route
pageRoute.get('/overview/:type/:id', renderOverview);

// Trending and Top Title List
pageRoute.get('/list/:type/:category', renderListTitle);

// Browse Route
pageRoute.get('/browse', renderBrowse);
