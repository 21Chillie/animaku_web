import type { Request, Response } from 'express';

export async function renderOverview(req: Request, res: Response) {
	res.render('overview');
}
