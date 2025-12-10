import * as userModel from '../models/user/user.models';
import type { User } from '../types/user.types';

export async function getByUsername(username: string): Promise<User | null> {
	return userModel.findUserByUsername(username);
}

export async function getByEmail(email: string): Promise<User | null> {
	return userModel.findUserByEmail(email);
}

export async function getById(id: string): Promise<User | null> {
	return userModel.findUserById(id);
}

export async function getByGoogleId(googleId: string): Promise<User | null> {
	return userModel.findUserByGoogleId(googleId);
}

export async function registerLocal(
	email: string,
	password_hash: string,
	username: string
): Promise<User> {
	return userModel.createLocalUser(email, password_hash, username);
}

export async function registerGoogle(
	username: string,
	googleId: string,
	email: string | null,
	password_hash: string,
	avatarUrl: string | null
): Promise<User> {
	return userModel.createGoogleUser(username, googleId, email, password_hash, avatarUrl);
}

export async function attachGoogle(
	id: string,
	googleId: string,
	avatar_url?: string | null
): Promise<void> {
	return userModel.linkGoogleToUser(id, googleId, avatar_url);
}
