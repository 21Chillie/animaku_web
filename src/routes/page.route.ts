import express from 'express';
import { renderIndex } from '../controllers/page/index.controller';
import { renderOverview } from '../controllers/page/overview.controller';
import { top100Anime } from '../controllers/page/list.controrller';

export const pageRoute = express.Router();

// Index route
pageRoute.get('/', renderIndex);

// Overview route
pageRoute.get('/overview/:type/:id', renderOverview);

// Trending and Top Title List
pageRoute.get('/list/:type/:category', top100Anime);
