import express from "express";
import { getAnimeTrending } from "../controllers/anime.controller";

export const animeRoutes = express.Router();

animeRoutes.get("/seasons/now", getAnimeTrending);
