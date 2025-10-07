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

  const synopsis =
    "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.\n\nAfter witnessing a horrific personal loss at the hands of the invading creatures, Eren Yeager dedicates his life to their eradication by enlisting into the Survey Corps, an elite military unit that combats the merciless humanoids outside the protection of the walls. Based on Hajime Isayama's award-winning manga, Shingeki no Kyojin follows Eren, along with his adopted sister Mikasa Ackerman and his childhood friend Armin Arlert, as they join the brutal war against the titans and race to discover a way of defeating them before the last walls are breached.\n\n(Source: MAL Rewrite)";

  res.render("anime-overview", { synopsis: synopsis.replace(/\n\n/g, "<br><br>") });
});

export default app;
