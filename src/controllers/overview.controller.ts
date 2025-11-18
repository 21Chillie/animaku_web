import type { Request, Response } from 'express';

function getAnimeData (type: string, id: number) {

}

export async function renderOverview(req: Request, res: Response) {
	res.render('overview');
}
