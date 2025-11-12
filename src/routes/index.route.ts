import express from "express";
import type { Request, Response } from "express";
import { renderAnimeTrending } from "../controllers/index.controller";

export const indexRoute = express.Router();

indexRoute.get("/", renderAnimeTrending);
