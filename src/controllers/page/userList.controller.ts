import type { Request, Response } from 'express';
import {
	addTitleToUserList,
	deleteTitleFromUserList,
	getUserList,
	updateTitleFromUserList,
} from '../../services/userList.service';
import {
	AddListRequestBody,
	AddListType,
	DeleteListRequestBody,
	DeleteListType,
	findUserListType,
	UpdateListRequestBody,
} from '../../types/user.types';

export async function renderUserList(req: Request, res: Response) {
	res.render('userList');
}

export async function postAddTitleToList(req: Request<{}, {}, AddListRequestBody>, res: Response) {
	const {
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

	const user = req.user?.id ?? null;

	// Convert numeric fields
	const mediaMalId = Number(inputMalId);
	const score = inputScore ? Number(inputScore) : null;
	const episode = inputEpisode ? Number(inputEpisode) : 0;
	const chapter = inputChapter ? Number(inputChapter) : 0;
	const volume = inputVolume ? Number(inputVolume) : 0;

	// Convert date fields
	const startDate = inputStartDate ? new Date(inputStartDate) : null;
	const finishDate = inputFinishDate ? new Date(inputFinishDate) : null;

	// Store all input fields in data object
	const data: AddListType = {
		userId: user,
		mediaMalId: mediaMalId,
		mediaType: inputType,
		status: selectStatus,
		score: score,
		progressEpisodes: episode,
		progressChapters: chapter,
		progressVolumes: volume,
		startDate: startDate,
		finishDate: finishDate,
		notes: inputNotes,
	};

	/**This is data for check user list
	 * for find media title from user list
	 * or check if media is already in user list
	 */
	const dataForCheckUserList: findUserListType = {
		userId: data.userId,
		mediaMalId: data.mediaMalId,
		mediaType: data.mediaType,
	};

	try {
		const checkUserList = await getUserList(dataForCheckUserList);

		// Check if the media is already exist in user list
		// If there is redirect to overview page (just in case)
		if (checkUserList) {
			console.warn(
				`${dataForCheckUserList.mediaType} with MAL ID ${dataForCheckUserList.mediaMalId} is already exist in the user list`
			);

			return res.redirect(
				`/overview/${dataForCheckUserList.mediaType}/${dataForCheckUserList.mediaMalId}`
			);
		}

		if (data.userId && data.mediaMalId) {
			const addListToDatabase = await addTitleToUserList(data);

			if (addListToDatabase) {
				console.log(
					`Success add media to user list. (${data.userId}, ${addListToDatabase.media_type}, ${addListToDatabase.media_mal_id} )`
				);
			}
		}

		res.redirect('/my-list');
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message, err.stack);
		}

		return res.render('error', {
			success: false,
			status_code: 500,
			error: 'Internal Server Error',
			message: 'Something went wrong while trying to insert media to user list',
			path: req.originalUrl,
		});
	}
}

export async function postDeleteTitleFromList(
	req: Request<{}, {}, DeleteListRequestBody>,
	res: Response
) {
	const { deleteListMalId, deleteListMediaType } = req.body;

	const user = req.user?.id ?? null;
	const mediaMalId = Number(deleteListMalId);

	// Store all input fields value in object
	const data: DeleteListType = {
		userId: user,
		mediaMalId: mediaMalId,
		mediaType: deleteListMediaType,
	};

	try {
		if (!data.userId && !data.mediaMalId) {
			return res.status(400).json({
				status_code: 400,
				error: 'Bad Request',
				message: 'Missing required input',
			});
		}

		// Check if media is already available in user list
		// if there isn't, redirect back to overview page (just in case)
		const checkUserList = await getUserList(data);
		if (!checkUserList) {
			console.warn(
				`${data.mediaType} with MAL ID ${data.mediaMalId} is not exists in user list, abort delete...`
			);
			return res.redirect(`/overview/${data.mediaType}/${data.mediaMalId}`);
		}

		await deleteTitleFromUserList(data);
		console.log(
			`Success delete media from user list. (${data.userId}, ${data.mediaType}, ${data.mediaMalId})`
		);

		res.redirect('/my-list');
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message, err.stack);
		}

		return res.render('error', {
			success: false,
			status_code: 500,
			error: 'Internal Server Error',
			message: 'Something went wrong while trying to delete media to user list',
			path: req.originalUrl,
		});
	}
}

export async function postEditTitleFromList(
	req: Request<{}, {}, UpdateListRequestBody>,
	res: Response
) {
	const {
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

	const user = req.user?.id ?? null;

	// Convert numeric fields
	const mediaMalId = Number(inputMalId);
	const score = inputScore ? Number(inputScore) : null;
	const episode = inputEpisode ? Number(inputEpisode) : 0;
	const chapter = inputChapter ? Number(inputChapter) : 0;
	const volume = inputVolume ? Number(inputVolume) : 0;

	// Convert date fields
	const startDate = inputStartDate ? new Date(inputStartDate) : null;
	const finishDate = inputFinishDate ? new Date(inputFinishDate) : null;

	// Store all input fields in data object
	const data: AddListType = {
		userId: user,
		mediaMalId: mediaMalId,
		mediaType: inputType,
		status: selectStatus,
		score: score,
		progressEpisodes: episode,
		progressChapters: chapter,
		progressVolumes: volume,
		startDate: startDate,
		finishDate: finishDate,
		notes: inputNotes,
	};

	const dataForCheckUserList: findUserListType = {
		userId: data.userId,
		mediaMalId: data.mediaMalId,
		mediaType: data.mediaType,
	};

	try {
		if (!data.userId && !data.mediaMalId) {
			console.error(`Missing required fields to update list`);
			return res.redirect(`/overview/${data.mediaType}/${data.mediaMalId}`);
		}

		const checkUserList = await getUserList(dataForCheckUserList);

		if (checkUserList) {
			const updatedList = await updateTitleFromUserList(data);
			updatedList
				? res.redirect('/my-list')
				: res.redirect(`/overview/${data.mediaType}/${data.mediaMalId}`);
		}
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message, err.stack);
			return res.render('error', {
				success: false,
				status_code: 500,
				error: 'Internal Server Error',
				message: 'Something went wrong while trying to updated media to user list',
				path: req.originalUrl,
			});
		}
	}
}
