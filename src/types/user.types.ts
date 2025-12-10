export interface User {
	id: string;
	email?: string | null;
	password_hash?: string | null;
	google_id?: string | null;
	username: string;
	avatar_url?: string | null;
	is_email_verified: boolean;
	created_at: string;
	updated_at: string;
}
