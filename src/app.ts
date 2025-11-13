import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

// Import Config
import { basicSecurityHeaders } from "./config/basicSecurity.config";
import { indexRoute } from "./routes/index.route";
import { animeRoutes } from "./routes/apiAnime.route";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(basicSecurityHeaders); // remove if not needed
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - relative to project root
app.use(express.static(path.join(__dirname, "../public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Routes

// 	Index Route
app.use("/", indexRoute);

app.use("/api/anime", animeRoutes);

export default app;
