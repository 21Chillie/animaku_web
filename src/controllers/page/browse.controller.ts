import type { Request, Response } from "express";

export async function renderBrowse (req: Request, res: Response) {
  res.render("browse")
}
