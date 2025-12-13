import {
	deleteListFromDatabase,
	findUserList,
	insertListToDatabase,
	updateListFromDatabase,
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
