import express from "express";
import type { Request, Response } from "express";

export const indexRoute = express.Router();

indexRoute.get("/", (req: Request, res: Response) => {
  res.render("index")
});
