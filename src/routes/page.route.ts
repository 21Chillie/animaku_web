import express from "express";
import { renderDataIndex } from "../controllers/index.controller";

export const indexRoute = express.Router();

indexRoute.get("/", renderDataIndex);
