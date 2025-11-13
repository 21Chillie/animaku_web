import express from "express";
import { getAnimeTrending } from "../controllers/apiGetAnimeTrending.controller";
import { getAnimeTop } from "../controllers/apiGetAnimeTop.controller";

export const animeRoutes = express.Router();

animeRoutes.get("/trending", getAnimeTrending);

animeRoutes.get("/top", getAnimeTop);
