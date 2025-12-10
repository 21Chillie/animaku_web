import 'express-session';

declare module 'express-session' {
	interface SessionData {
		userId?: string;

		oauthProfile?: {
			provider: string;
			id: string;
			email?: string | null;
			avatarUrl?: string | null;
		} | null;
	}
}

declare global {
	namespace Express {
		interface User {
			id: string;
			username: string;
			email?: string | null;
			google_id?: string | null;
			avatar_url?: string | null;
		}
	}
}
