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
      "filter[text]": inputSearch.toLowerCase(),
      "filter[subtype]": inputType,
      "page[limit]": 10,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/${inputCategory}`, config);

    const animeDataResult = response.data.data.map((item) => ({
      id: item.id,
      title: item.attributes.canonicalTitle || "N/A",
      rating: item.attributes.averageRating || "N/A",
      episode:
        item.attributes.episodeCount || item.attributes.chapterCount || "N/A",
      type: item.attributes.subtype.toUpperCase() || "NA",
      cover:
        item.attributes.posterImage.small || "/images/no-img-placeholder.webp",
      category: inputCategory,
    }));

    res.render("browse", { animeDataResult });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Oops something went wrong!", err });
  }
});

app.get("/anime/:id", async (req, res) => {
  // Anime ID
  const id = req.params.id;

  // Fetch anime data by ID
  const response = await axios.get(`${API_URL}/anime/${id}`);

  const synopsisReplace =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  try {
    // Function For fetching data For Title, Poster, Synopsis
    const animeTitle = () => {
      const item = response.data.data;

      const data = {
        id: item.id,
        title: item.attributes.canonicalTitle || "N/A",
        poster:
          item.attributes.posterImage.small ||
          "/images/no-img-placeholder.webp",
        synopsis:
          item.attributes.synopsis.replace(/\n\n/g, "<br><br>") ||
          synopsisReplace,
      };

      return data;
    };

    // Function fetching data for Meta Info
    const metaInfo = async () => {
      const item = response.data.data;

      // Format Status Data
      const status =
        item.attributes.status.charAt(0).toUpperCase() +
        item.attributes.status.slice(1);

      // Fetch genres data
      const genreResponse = await axios.get(
        `${API_URL}/anime/${id}/categories`,
      );

      try {
        // Push genres name into array
        const genres = genreResponse.data.data.map(
          (genre) => genre.attributes.title,
        );

        const data = {
          animeId: item.id,
          type: item.attributes.subtype || "N/A",
          ageRating: `${item.attributes.ageRating || "N/A"} - ${item.attributes.ageRatingGuide || "N/A"}`,
          episode: item.attributes.episodeCount || "-",
          episodeLength: item.attributes.episodeLength || "-",
          startDate: item.attributes.startDate || "-",
          endDate: item.attributes.endDate || "-",
          status: status || "N/A",
          avgRating: item.attributes.averageRating || "-",
          ratingRank: item.attributes.ratingRank || "-",
          userCount: item.attributes.userCount || "-",
          popularityRank: item.attributes.popularityRank || "-",
          genres: genres.join(", ") || "-",
        };

        return data;
      } catch {
        console.log("Error fetch genre data!");
      }
    };

    // Function for fetching anime relation data
    const animeRelation = async () => {
      const relationResponse = await axios.get(
        `${API_URL}/anime/${id}/media-relationships`,
        {
          params: {
            "filter[role]":
              "adaptation,prequel,sequel,parent_story,side_story,spinoff",
          },
        },
      );

      return relationResponse.data.data;
    };

    console.log(await animeRelation());

    res.render("anime-overview", {
      animeTitle: animeTitle(),
      metaInfo: await metaInfo(),
    });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Oops something went wrong!", err });
  }
});

export default app;
