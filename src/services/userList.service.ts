import {
	deleteListFromDatabase,
	findUserList,
	insertListToDatabase,
	updateListFromDatabase,
	UserListPaginated,
} from '../models/user/userList.models';
import type {
	AddListType,
	DeleteListType,
	findUserListType,
	UpdateListType,
	UserList,
} from '../types/user.types';

export async function getUserList(inputValue: findUserListType): Promise<UserList | null> {
	return findUserList(inputValue);
}

export async function addTitleToUserList(inputValue: AddListType): Promise<UserList | null> {
	return insertListToDatabase(inputValue);
}

export async function deleteTitleFromUserList(
	inputValue: DeleteListType
): Promise<UserList | null> {
	return deleteListFromDatabase(inputValue);
}

export async function updateTitleFromUserList(
	inputValue: UpdateListType
): Promise<UserList | null> {
	return updateListFromDatabase(inputValue);
}

export async function getUserListPaginated(
	userId: string,
	limit: number,
	offset: number,
	orderBy: 'title' | 'recent' | 'score' = 'title',
	orderDirection: 'ASC' | 'DESC' = 'ASC',
	filterType?: 'anime' | 'manga',
	filterStatus?: string
): Promise<{ list: UserList[]; totalRecords: number }> {
	return UserListPaginated(
		userId,
		limit,
		offset,
		orderBy,
		orderDirection,
		filterType,
		filterStatus
	);
}
