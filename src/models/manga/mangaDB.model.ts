import type { QueryResult } from 'pg';
import pool from '../../config/database.config';
import { DatabaseMangaTypes } from '../../types/database.types';
import { Manga } from '../../types/mangaData.types';

export async function insertMangaDataByMalId(data: Manga) {
	try {
		await pool.query(
			`
			INSERT INTO manga(mal_id, data)
			VALUES ($1, $2)
			ON CONFLICT (mal_id)
			DO UPDATE SET 
    		data = EXCLUDED.data,
    		last_updated_at = CURRENT_TIMESTAMP;
			`,
			[data.mal_id, data]
		);
	} catch (err) {
		console.error('Error while inserting manga data into database: ', err);
	}
}

export async function getMangaByMalId(mal_id: number): Promise<DatabaseMangaTypes> {
	const result: QueryResult<DatabaseMangaTypes> = await pool.query(
		`SELECT * FROM manga WHERE mal_id = $1`,
		[mal_id]
	);

	return result.rows[0];
}

export async function getAllManga(): Promise<DatabaseMangaTypes[]> {
	const result: QueryResult<DatabaseMangaTypes> = await pool.query(`SELECT * FROM manga`);

	return result.rows;
}

export async function getMangaCount(): Promise<number> {
	const result = await pool.query(`SELECT COUNT(*) FROM manga`);
	console.log(result.rows[0].count);
	return parseInt(result.rows[0].count);
}

// Get paginated manga records with search, filters, and sorting
export async function getMangaPaginated(
	limit: number,
	offset: number,
	search: string = '',
	orderBy: string = 'rank',
	orderDirection: string = 'ASC',
	filterType: string = '',
	filterStatus: string = ''
): Promise<{ manga: DatabaseMangaTypes[]; totalRecords: number }> {
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
				manga: ['Manga'],
				novel: ['Novel'],
				lightnovel: ['Light Novel'],
				oneshot: ['One-shot'],
				doujin: ['Doujinshi'],
				manhwa: ['Manhwa'],
				manhua: ['Manhua'],
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
				finished: 'Finished',
				publishing: 'Publishing',
				hiatus: 'On Hiatus',
				discontinued: 'Discontinued',
			};

			const dbStatus = statusMapping[filterStatus.toLowerCase()];
			if (dbStatus) {
				conditions.push(`status = $${paramCount}`);
				queryParams.push(dbStatus);
			}
		}

		const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

		// Count query
		const countQuery = `SELECT COUNT(*) FROM manga ${whereClause}`;
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
            SELECT * FROM manga 
            ${whereClause}
            ${orderByClause}
            LIMIT $${paramCount + 1} 
            OFFSET $${paramCount + 2}
        `;

		// Add limit and offset to parameters
		queryParams.push(limit, offset);

		const result = await client.query(finalQuery, queryParams);

		return {
			manga: result.rows,
			totalRecords,
		};
	} finally {
		client.release();
	}
}
