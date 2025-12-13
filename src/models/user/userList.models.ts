import type { QueryResult } from 'pg';
import pool from '../../config/database.config';
import type {
	AddListType,
	DeleteListType,
	findUserListType,
	UpdateListType,
	UserList,
} from '../../types/user.types';

export async function findUserList(inputValue: findUserListType): Promise<UserList | null> {
	const client = await pool.connect();
	const data = { ...inputValue };
	try {
		const result: QueryResult<UserList> = await client.query(
			`
	  SELECT * FROM user_list ul 
	  WHERE ul.user_id = $1 AND ul.media_mal_id = $2 AND ul.media_type = $3
	  `,
			[data.userId, data.mediaMalId, data.mediaType]
		);

		return result.rows[0];
	} catch (err) {
		console.error('Something went wrong while find user list: ', err);
		throw new Error('Something went wrong while find user list');
	} finally {
		client.release();
	}
}

export async function insertListToDatabase(inputValue: AddListType): Promise<UserList | null> {
	const client = await pool.connect();

	const data = { ...inputValue };

	try {
		const result: QueryResult<UserList> = await client.query(
			`
      INSERT INTO user_list (user_id, media_mal_id, media_type, status, score, progress_episodes, progress_chapters, progress_volumes, start_date, finish_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
			[
				data.userId,
				data.mediaMalId,
				data.mediaType,
				data.status,
				data.score,
				data.progressEpisodes,
				data.progressChapters,
				data.progressVolumes,
				data.startDate,
				data.finishDate,
				data.notes,
			]
		);

		return result.rows[0];
	} catch (err) {
		console.error('Something went wrong while insert title to user list: ', err);
		throw new Error('Something went wrong while insert title to user list');
	} finally {
		client.release();
	}
}

export async function deleteListFromDatabase(inputValue: DeleteListType): Promise<UserList | null> {
	const client = await pool.connect();
	const data = { ...inputValue };

	try {
		const result: QueryResult<UserList> = await client.query(
			`
      DELETE FROM user_list
      WHERE user_id = $1
        AND media_mal_id = $2
        AND media_type = $3
      RETURNING *
      `,
			[data.userId, data.mediaMalId, data.mediaType]
		);

		return result.rows[0];
	} catch (err) {
		console.error('Something went wrong while delete title from user list: ', err);
		throw new Error('Something went wrong while delete title from user list');
	} finally {
		client.release();
	}
}

export async function updateListFromDatabase(inputValue: UpdateListType): Promise<UserList | null> {
	const client = await pool.connect();
	const data = { ...inputValue };

	try {
		const result: QueryResult<UserList> = await client.query(
			`
			UPDATE user_list
			SET
					status = $1,
					score = $2,
					progress_episodes = $3,
					progress_chapters = $4,
					progress_volumes = $5,
					start_date = $6,
					finish_date = $7,
					notes = $8,
					updated_at = NOW()
			WHERE user_id = $9
					AND media_mal_id = $10
					AND media_type = $11
			RETURNING *
			`,
			[
				data.status,
				data.score,
				data.progressEpisodes,
				data.progressChapters,
				data.progressVolumes,
				data.startDate,
				data.finishDate,
				data.notes,
				data.userId,
				data.mediaMalId,
				data.mediaType,
			]
		);

		return result.rows[0];
	} catch (err) {
		console.error(
			`Something went wrong while update ${data.mediaType} with MAL ID ${data.mediaMalId} from user list: `,
			err
		);

		throw new Error('Something went wrong while update list from user list');
	}
}
