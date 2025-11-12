import type { Request, Response } from "express";
import pool from "../config/database.config";
import { fetchAnimeTrending } from "../services/anime.service";
import { seedTableAnimeTrending } from "../models/seedTableTrending";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.JIKAN_BASE_URL;

export async function renderAnimeTrending(req: Request, res: Response) {
	const client = await pool.connect();
	try {
		const oldAnimeDatabase = await client.query(`SELECT * FROM anime_trending WHERE created_at >= NOW() - INTERVAL '30 days'`);
		const animeTrendingDatabase = await client.query(
			`
			SELECT * FROM anime_trending t
			ORDER BY (data->>'popularity'):: INTEGER ASC
			LIMIT 12
			`
		);

		if (oldAnimeDatabase.rowCount === 0) {
			console.log("Database empty, fetching from api...");

			await client.query("DELETE FROM anime_trending");

			const data = await fetchAnimeTrending();
			seedTableAnimeTrending(data).catch((err) => console.error("Failed too seed database: ", err));

			const dataFromAPI = data.slice(0, 12);

			return res.status(200).render("index", { success: true, data: dataFromAPI, source: "API" });
		}

		console.log("Success get anime trending list data from database");

		res.status(200).render("index", { success: true, data: animeTrendingDatabase.rows, source: "Database" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: "Something went from while fetching anime trending data" });
	} finally {
		client.release();
	}
}
