import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseMangaTypes } from '../../types/database.types';
import { DatabaseError } from '../../utils/databaseError.utils';

export async function getOldMangaTop(daysThreshold: number): Promise<DatabaseMangaTypes[]> {
	const client = await pool.connect();
	try {
		const result: QueryResult<DatabaseMangaTypes> = await client.query(
			`SELECT * FROM manga_top WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
			[daysThreshold]
		);

		return result.rows;
	} catch (err) {
		console.error(
			`Error getting old records (>${daysThreshold} days) from 'manga_top' table:`,
			err
		);
		throw new DatabaseError(`Failed to get old records from 'manga_top' table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}

export async function deleteOldMangaTop(daysThreshold: number) {
	const client = await pool.connect();

	try {
		await client.query(
			`DELETE FROM manga_top WHERE last_updated_at <= NOW() - make_interval(days => $1)`,
			[daysThreshold]
		);
	} catch (err) {
		console.error(`Error deleting old records (>${daysThreshold} days) in 'manga_top' table:`, err);
		throw new DatabaseError(
			`Failed to delete old records (>${daysThreshold} days) in 'manga_top' table`,
			{ cause: err }
		);
	} finally {
		client.release();
	}
}

export async function deleteAllOldMangaTop() {
	const client = await pool.connect();

	try {
		await client.query(`TRUNCATE TABLE manga_top RESTART IDENTITY;`);
	} catch (err: unknown) {
		console.error(`Error truncating 'manga_top' table:`, err);
		throw new DatabaseError(`Failed to delete all records from 'manga_top' table`, { cause: err });
	} finally {
		client.release();
	}
}

export async function getAllMangaTop(): Promise<DatabaseMangaTypes[]> {
	const client = await pool.connect();

	try {
		const result: QueryResult<DatabaseMangaTypes> = await client.query(
			`SELECT * FROM manga_top ORDER BY score DESC`
		);

		return result.rows;
	} catch (err) {
		console.error(`Error getting all records from 'manga_top' table:`, err);
		throw new DatabaseError(`Failed to get all records in 'manga_top' table`, { cause: err });
	} finally {
		client.release();
	}
}

export async function getMangaTopLimit(maxRecords: number): Promise<DatabaseMangaTypes[]> {
	const client = await pool.connect();

	try {
		const result = await client.query(`SELECT * FROM manga_top t ORDER BY t.score DESC LIMIT $1`, [
			maxRecords,
		]);

		return result.rows;
	} catch (err) {
		console.error(`Error getting ${maxRecords} records from 'manga_top' table:`, err);
		throw new DatabaseError(`Failed to get ${maxRecords} records in 'manga_top table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}

export async function getMangaTopCount(): Promise<number> {
	const client = await pool.connect();

	try {
		const result = await client.query(`SELECT * FROM manga_top`);
		return result.rowCount ?? 0;
	} catch (err) {
		console.error(`Error getting total records number in 'manga_top' table:`, err);
		throw new DatabaseError(`Failed to get total records number in 'manga_top' table`, {
			cause: err,
		});
	} finally {
		client.release();
	}
}

export async function getMangaTopPaginated(
	limit: number,
	offset: number
): Promise<DatabaseMangaTypes[]> {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`
			SELECT * FROM manga_top
      ORDER BY rank ASC NULLS LAST
      LIMIT $1 OFFSET $2`,
			[limit, offset]
		);
		return result.rows;
	} catch (err: unknown) {
		console.error(
			`Error getting paginated data from 'manga_top' table (limit=${limit}, offset=${offset}):`,
			err
		);
		throw new DatabaseError(`Failed to get paginated data from 'manga_top' table`, { cause: err });
	} finally {
		client.release();
	}
}
