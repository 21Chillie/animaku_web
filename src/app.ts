import cors from 'cors';
import express from 'express';
import path from 'path';

// Import Config
import { basicSecurityHeaders } from './config/basicSecurity.config';
import { apiRoutes } from './routes/api.routes';
import { pageRoute } from './routes/page.route';

// Initialize express app
const app = express();

// Middleware
app.use(basicSecurityHeaders); // remove if not needed
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - relative to project root
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes

// 	Index Route
app.use('/', pageRoute);

// Api routes
app.use('/api', apiRoutes);

export default app;
