import { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { Anime } from '../../types/animeData.types';
import { DatabaseAnimeTypes } from '../../types/database.types';

export async function insertAnimeDataByMalId(data: Anime) {
	try {
		await pool.query(
			`
			INSERT INTO anime(mal_id, data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		data = EXCLUDED.data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[data.mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting anime data into database: ', err);
	}
}

export async function getOldAnime(
	daysThreshold: number,
	mal_id: number
): Promise<DatabaseAnimeTypes[]> {
	const result: QueryResult<DatabaseAnimeTypes> = await pool.query(
		`SELECT * FROM anime WHERE last_updated_at <= NOW() - make_interval(days => $1) AND mal_id = $2`,
		[daysThreshold, mal_id]
	);

	return result.rows;
}

export async function getAnimeByMalId(mal_id: number): Promise<DatabaseAnimeTypes> {
	const result: QueryResult<DatabaseAnimeTypes> = await pool.query(
		`SELECT * FROM anime WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0];
}

export async function getAllAnime(): Promise<DatabaseAnimeTypes[]> {
	const result: QueryResult<DatabaseAnimeTypes> = await pool.query(`SELECT * FROM anime`);

	return result.rows;
}

export async function getAnimeCount(): Promise<number> {
	const result = await pool.query(`SELECT COUNT(*) FROM anime`);
	console.log(result.rows[0].count);
	return parseInt(result.rows[0].count);
}

// Get paginated anime records with search, filters, and sorting
export async function getAnimePaginated(
	limit: number,
	offset: number,
	search: string = '',
	orderBy: string = 'rank',
	orderDirection: string = 'ASC',
	filterType: string = '',
	filterStatus: string = ''
): Promise<{ anime: DatabaseAnimeTypes[]; totalRecords: number }> {
	const client = await pool.connect();
	try {
		// Validate orderBy to prevent SQL injection
		const validOrderColumns = ['rank', 'score', 'popularity', 'year', 'title'];
		const safeOrderBy = validOrderColumns.includes(orderBy) ? orderBy : 'rank';

		// Validate order direction
		const safeOrderDirection = orderDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

		const conditions: string[] = [];
		const queryParams: any[] = [];
		let paramCount = 0;

		// Add search condition if provided
		if (search) {
			paramCount++;
			conditions.push(`title ILIKE $${paramCount}`);
			queryParams.push(`%${search}%`);
		}

		// Add type filter if provided
		if (filterType) {
			paramCount++;
			const typeMapping: { [key: string]: string[] } = {
				tv: ['TV'],
				movie: ['Movie'],
				ova: ['OVA'],
				special: ['Special'],
				ona: ['ONA'],
				pv: ['PV'],
				tv_special: ['TV Special'],
			};

			const dbTypes = typeMapping[filterType.toLowerCase()];
			if (dbTypes) {
				conditions.push(`type = ANY($${paramCount})`);
				queryParams.push(dbTypes);
			}
		}

		// Add status filter if provided
		if (filterStatus) {
			paramCount++;
			const statusMapping: { [key: string]: string } = {
				finished: 'Finished Airing',
				airing: 'Currently Airing',
			};

			const dbStatus = statusMapping[filterStatus.toLowerCase()];
			if (dbStatus) {
				conditions.push(`status = $${paramCount}`);
				queryParams.push(dbStatus);
			}
		}

		const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

		// Count query
		const countQuery = `SELECT COUNT(*) FROM anime ${whereClause}`;
		const countResult = await client.query(countQuery, queryParams);
		const totalRecords = parseInt(countResult.rows[0].count);

		// Main query with sorting
		// For NULLS LAST handling (especially for rank/score which might have nulls)
		let orderByClause = '';
		if (safeOrderBy === 'score' || safeOrderBy === 'rank') {
			orderByClause = `ORDER BY ${safeOrderBy} ${safeOrderDirection} NULLS LAST, id ASC`;
		} else {
			orderByClause = `ORDER BY ${safeOrderBy} ${safeOrderDirection}`;
		}

		const finalQuery = `
            SELECT * FROM anime 
            ${whereClause}
            ${orderByClause}
            LIMIT $${paramCount + 1} 
            OFFSET $${paramCount + 2}
        `;

		// Add limit and offset to parameters
		queryParams.push(limit, offset);

		const result = await client.query(finalQuery, queryParams);

		return {
			anime: result.rows,
			totalRecords,
		};
	} finally {
		client.release();
	}
}
