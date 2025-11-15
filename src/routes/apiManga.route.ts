import express from "express";
import { getMangaTop } from "../controllers/apiGetMangaTop.controller";

export const mangaRoutes = express.Router();

mangaRoutes.get("/top", getMangaTop);
