import express from 'express';
import {
	postLogin,
	postRegister,
	renderLogin,
	renderRegister,
} from '../controllers/page/authPage.route';
import { renderBrowse } from '../controllers/page/browse.route';
import { renderCharacter } from '../controllers/page/character.controller';
import { renderIndex } from '../controllers/page/index.controller';
import { renderListTitle } from '../controllers/page/list.controller';
import { renderOverview } from '../controllers/page/overview.controller';

export const pageRoute = express.Router();

// Index route
pageRoute.get('/', renderIndex);

// Login Route
pageRoute.get('/login', renderLogin);
pageRoute.post('/login', postLogin);

// Sign Up Route
pageRoute.get('/register', renderRegister);
pageRoute.post('/register', postRegister);

// Overview Character
pageRoute.get('/overview/character/:id', renderCharacter);

// Overview route
pageRoute.get('/overview/:type/:id', renderOverview);

// Trending and Top Title List
pageRoute.get('/list/:type/:category', renderListTitle);

// Browse Route
pageRoute.get('/browse', renderBrowse);
