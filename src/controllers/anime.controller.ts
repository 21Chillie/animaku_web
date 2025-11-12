import pool from "../config/database.config";
import { Request, Response } from "express";
import { fetchAnimeTrending } from "../services/anime.service";
import { seedTableAnimeTrending } from "../models/seedTableTrending";

export async function getAnimeTrending(req: Request, res: Response) {
	const client = await pool.connect();
	try {
		const animeTrendingDatabase = await client.query(`SELECT * FROM anime_trending WHERE created_at >= NOW() - INTERVAL '30 days'`);

		if (animeTrendingDatabase.rowCount === 0) {
			console.log("Database empty, fetching from api...");

			await client.query("DELETE FROM anime_trending");

			const dataFromAPI = await fetchAnimeTrending();
			seedTableAnimeTrending(dataFromAPI).catch((err) => console.error("Failed too seed database: ", err));

			return res.status(200).json({ success: true, data: dataFromAPI, source: "API" });
		}

		console.log("Success get anime trending list data from database");

		res.status(200).json({ success: true, data: animeTrendingDatabase.rows, source: "Database" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: "Something went from while fetching anime trending data" });
	} finally {
		client.release();
	}
}
