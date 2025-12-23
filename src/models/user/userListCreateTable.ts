import pool from '../../config/database.config';

/* 
UNIQUE (user_id, media_type, media_mal_id)

The line above is prevent duplicates

EXAMPLE 1
(user A, anime, 5)
(user A, anime, 5) <- ERROR
This will get an error, because duplication

EXAMPLE 2
(user A, anime, 5)
(user B, anime, 5) <- SUCCESS


*/

export async function createUserListTable(): Promise<void> {
	const client = await pool.connect();

	try {
		await client.query(
			`
      CREATE TABLE IF NOT EXISTS user_list(
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      media_mal_id INTEGER NOT NULL,
      media_type TEXT NOT NULL CHECK (media_type IN ('anime', 'manga')),
      status TEXT NOT NULL CHECK (status IN (
          'watching',
          'reading',
          'plan_read',
          'plan_watch',
          'completed',
          'paused',
          'dropped'
      )),
      score INTEGER CHECK (score BETWEEN 0 AND 10),
      progress_episodes INTEGER DEFAULT 0,
      progress_chapters INTEGER DEFAULT 0,
      progress_volumes INTEGER DEFAULT 0,
      start_date DATE,
      finish_date DATE,
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

      UNIQUE (user_id, media_type, media_mal_id)
      );
      `
		);

		console.log("Successfully created 'user_list' table");
	} catch (err) {
		console.error("Error while creating 'user_list' table: ", err);
	} finally {
		client.release();
	}
}


