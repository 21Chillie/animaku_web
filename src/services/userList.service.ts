import {
	deleteListFromDatabase,
	findUserList,
	insertListToDatabase,
} from '../models/user/userList.models';
import type { AddListType, DeleteListType, findUserListType, UserList } from '../types/user.types';

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

// TODO: Create Update List Function
