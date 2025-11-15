import express from 'express';
import { renderIndex } from '../controllers/index.controller';
import { renderOverview } from '../controllers/overview.controller';

export const pageRoute = express.Router();

// Index route
pageRoute.get('/', renderIndex);

// Overview route
pageRoute.get('/overview/:type/:id', renderOverview);
