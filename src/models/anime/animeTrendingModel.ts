import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseAnimeTypes } from '../../types/database.types';
import { DatabaseError } from '../../utils/databaseError.utils';

export async function getOldAnimeTrending(daysThreshold: number): Promise<DatabaseAnimeTypes[]> {
	const client = await pool.connect();

	try {
		const result: QueryResult<DatabaseAnimeTypes> = await client.query(
			`SELECT * FROM anime_trending WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
			[daysThreshold]
		);

		return result.rows;
	} catch (err: unknown) {
		console.error(`Error getting old records (>${daysThreshold} days) from 'anime_trending':`, err);
		throw new DatabaseError(`Failed to get old records from 'anime_trending' table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}

export async function deleteOldAnimeTrending(daysThreshold: number) {
	const client = await pool.connect();

	try {
		await client.query(
			`DELETE FROM anime_trending WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
			[daysThreshold]
		);
	} catch (err: unknown) {
		console.error(`Error deleting records (>${daysThreshold} days) from 'anime_trending':`, err);
		throw new DatabaseError(`Failed to delete old records from 'anime_trending' table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}

export async function deleteAllOldAnimeTrending() {
	const client = await pool.connect();
	try {
		await client.query(`TRUNCATE TABLE anime_trending RESTART IDENTITY;`);
	} catch (err: unknown) {
		console.error("Error truncating 'anime_trending' table:", err);
		throw new DatabaseError(`Failed to delete all records from 'anime_trending' table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}

export async function getAllAnimeTrending(): Promise<DatabaseAnimeTypes[]> {
	const client = await pool.connect();
	try {
		const result: QueryResult<DatabaseAnimeTypes> = await client.query(
			`SELECT * FROM anime_trending ORDER BY (data->>'popularity'):: INTEGER ASC`
		);

		return result.rows;
	} catch (err: unknown) {
		console.error(`Error getting all records from 'anime_trending' table:`, err);
		throw new DatabaseError(`Failed to get all records from 'anime_trending' table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}

export async function getAnimeTrendingLimit(maxRecords: number): Promise<DatabaseAnimeTypes[]> {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`SELECT * FROM anime_trending ORDER BY (data->>'popularity'):: INTEGER ASC LIMIT $1`,
			[maxRecords]
		);

		return result.rows;
	} catch (err: unknown) {
		console.error(`Error getting ${maxRecords} records from 'anime_trending' table:`, err);
		throw new DatabaseError(`Failed to get ${maxRecords} records from 'anime_trending' table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}

export async function getAnimeTrendingCount(): Promise<number> {
	const client = await pool.connect();

	try {
		const result = await client.query(`SELECT * FROM anime_trending`);
		return result.rowCount ?? 0;
	} catch (err: unknown) {
		console.error(`Error getting total record count from 'anime_trending' table:`, err);
		throw new DatabaseError(`Failed to get total record count from 'anime_trending' table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}

export async function getAnimeTrendingPaginated(
	limit: number,
	offset: number
): Promise<DatabaseAnimeTypes[]> {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`
			SELECT * FROM anime_trending
      ORDER BY popularity ASC NULLS LAST 
      LIMIT $1 OFFSET $2`,
			[limit, offset]
		);
		return result.rows;
	} catch (err: unknown) {
		console.error(
			`Error getting paginated data from 'anime_trending' table (limit=${limit}, offset=${offset}):`,
			err
		);
		throw new DatabaseError(`Failed to get paginated data from 'anime_trending' table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}
