import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import pool from "./db.js";

const app = express();

// Helpers for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/browse", (req, res) => {
  res.render("browse", { inputSearch: null, inputType: null, inputCategory: null });
});

app.post("/browse", async (req, res) => {
  const { inputSearch, inputType, inputCategory } = req.body;

  res.render("browse", { inputSearch, inputType, inputCategory });
});

export default app;
