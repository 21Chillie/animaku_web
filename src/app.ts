import cors from 'cors';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { basicSecurityHeaders } from './config/basicSecurity.config';
import { NODE_ENV, SESSION_SECRET } from './config/env.config';
import './config/passport';
import { apiRoutes } from './routes/api.routes';
import { authRoute } from './routes/auth.routes';
import { pageRoute } from './routes/page.route';

// Initialize express app
const app = express();

// Static files - relative to project root
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
// app.use(basicSecurityHeaders); // remove if not needed
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: SESSION_SECRET || 'secretpassworddefault',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	if (req.user) {
		res.locals.user = {
			id: req.user.id,
			email: req.user.email,
			username: req.user.username,
			avatar: req.user.avatar_url,
		};
	} else {
		res.locals.user = null;
	}
	next();
});

// 	Index Route
app.use('/', pageRoute);

// Auth Route
app.use('/auth', authRoute);

// Api routes
app.use('/api', apiRoutes);

export default app;
