import express from 'express';
import { renderBrowse } from '../controllers/page/browse.controller';
import { renderCharacter } from '../controllers/page/character.controller';
import { renderIndex } from '../controllers/page/index.controller';
import { renderListTitle } from '../controllers/page/list.controller';
import { renderOverview } from '../controllers/page/overview.controller';
import {
	postAddTitleToList,
	postDeleteTitleFromList,
	postEditTitleFromList,
	renderUserList,
} from '../controllers/page/userList.controller';
import { isAuthenticated } from '../middlewares/checkAuth';

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

// User List Route
pageRoute.get('/my-list', isAuthenticated, renderUserList);

// Add title to user list (POST)
pageRoute.post('/my-list/added', isAuthenticated, postAddTitleToList);

// Delete title from user list (POST)
pageRoute.post('/my-list/deleted', isAuthenticated, postDeleteTitleFromList);

// Edit title from user list (POST)
pageRoute.post('/my-list/updated', isAuthenticated, postEditTitleFromList);
