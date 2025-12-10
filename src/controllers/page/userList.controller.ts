import type { Request, Response } from 'express';

export async function renderUserList(req: Request, res: Response) {
	res.render('userList');
}

export async function postAddTitleToList(req: Request, res: Response) {
	const {
		inputUserId,
		inputMalId,
		inputType,
		selectStatus,
		inputScore,
		inputEpisode,
		inputChapter,
		inputVolume,
		inputStartDate,
		inputFinishDate,
		inputNotes,
	} = req.body;

	const addToListForm = {
		user: inputUserId,
		malId: inputMalId,
		type: inputType,
		status: selectStatus,
		score: inputScore,
		episode: inputEpisode,
		chapter: inputChapter,
		volume: inputVolume,
		startDate: inputStartDate,
		finishDate: inputFinishDate,
		notes: inputNotes,
	};

	console.log(addToListForm);

	res.redirect('/my-list');
}

export async function postDeleteTitleFromList(req: Request, res: Response) {
	const { deleteListUser, deleteListMalId } = req.body;

	const deleteListForm = {
		user: deleteListUser,
		malId: deleteListMalId,
	};

	console.log(deleteListForm);

	res.redirect('/my-list');
}
