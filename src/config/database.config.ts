import { Pool } from "pg";
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from "./env.config";

const pool = new Pool({
	host: DB_HOST,
	port: parseInt(DB_PORT || "5432"),
	database: DB_NAME,
	user: DB_USER,
	password: DB_PASSWORD,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	maxLifetimeSeconds: 60,
});

// Test Connection

pool.on("connect", () => {
	console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
	console.log("Database connection error: ", err);
});

export default pool;
