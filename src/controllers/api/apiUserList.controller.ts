import type { Request, Response } from 'express';
import { UserListPaginated } from '../../models/user/userList.models';
import { getUserListPaginated } from '../../services/userList.service';

export async function getListEachUser(req: Request, res: Response) {
	const user = req.user?.id;

	// ensure valid sort/order types
	const orderBy = (req.query.order_by as 'title' | 'recent' | 'score') || 'title';
	const orderDirection = (req.query.order_direction as 'ASC' | 'DESC') || 'ASC';

	// filter by type/status (allow undefined)
	const type = req.query.type as 'anime' | 'manga' | undefined;
	const status = req.query.status as string | undefined;

	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 30;
	const offset = (page - 1) * limit;

	if (!user) {
		return res.status(401).json({
			success: false,
			status_code: 401,
			error: 'Unauthorized',
			message: 'Authentication is required to access this resource, please login or register',
		});
	}

	if (limit > 30) {
		return res.status(400).json({
			success: false,
			status_code: 400,
			error: 'Bad Request',
			message: `The input limit value is ${limit} and it's higher than the configured '30'`,
		});
	}

	const { list, totalRecords } = await getUserListPaginated(
		user,
		limit,
		offset,
		orderBy,
		orderDirection,
		type,
		status
	);

	const totalPages = Math.ceil(totalRecords / limit);

	res.status(200).json({
		success: true,
		list,
		pagination: {
			currentPage: page,
			totalPages: totalPages,
			totalRecords,
			hasNext: page < totalPages,
			hasPrev: page > 1,
			limit,
		},
		filters: {
			type,
			status,
			orderBy,
			orderDirection,
		},
	});
}
