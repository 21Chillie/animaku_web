import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import pool from "./db.js";

const app = express();

// Helpers for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_URL = "https://kitsu.io/api/edge/";

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
  res.render("browse", { animeDataResult: null });
});

app.post(`/browse`, async (req, res) => {
  const { inputSearch, inputType, inputCategory } = req.body;

  let config = {
    params: {
      "filter[text]": inputSearch,
      "filter[subtype]": inputType,
      "page[limit]": 10,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/${inputCategory}`, config);

    const animeDataResult = response.data.data.map((item) => ({
      id: item.id,
      title: item.attributes.canonicalTitle,
      rating: item.attributes.averageRating,
      episode: item.attributes.episodeCount || item.attributes.chapterCount,
      type: item.attributes.subtype.toUpperCase(),
      cover: item.attributes.posterImage.small || "/images/no-img-placeholder.webp",
      category: inputCategory,
    }));

    res.render("browse", { animeDataResult });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Oops something went wrong!", err });
  }
});

app.get("/anime/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);

  res.render("anime-overview");
});

export default app;
