import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const { PORT, NODE_ENV, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JIKAN_BASE_URL } = process.env;
