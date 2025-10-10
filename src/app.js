import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios, { all } from "axios";
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

// Home Routes
app.get("/", (req, res) => {
  res.render("index");
});

// Browse Routes
app.get("/browse", (req, res) => {
  res.render("browse", { searchResult: null });
});

// Browser Result Routes
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

    const searchResult = response.data.data.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.attributes.canonicalTitle || "N/A",
      rating: item.attributes.averageRating || "N/A",
      episode:
        item.attributes.episodeCount || item.attributes.chapterCount || "N/A",
      subType: item.attributes.subtype.toUpperCase() || "NA",
      cover:
        item.attributes.posterImage.tiny || "/images/no-img-placeholder.webp",
      category: inputCategory,
    }));

    res.render("browse", { searchResult });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Oops something went wrong!", err });
  }
});

// Animaku Overview Routes
app.get("/overview/:type/:id", async (req, res) => {
  // Media ID and type
  const { id, type } = req.params;

  try {
    // Fetch media data by ID
    const response = await axios.get(`${API_URL}/${type}/${id}`);

    // Function For fetching data For Title, Poster, Synopsis
    const mediaTitle = () => {
      try {
        const item = response.data.data;

        const data = {
          id: item.id,
          type: item.type,
          title: item.attributes.canonicalTitle || "N/A",
          poster:
            item.attributes.posterImage.small ||
            "/images/no-img-placeholder.webp",
          synopsis:
            item.attributes.synopsis.replace(/\n\n/g, "<br><br>") ||
            "This anime currently does not have a synopsis available. Check back later for updates or explore other details about the series.",
        };

        return data;
      } catch (err) {
        console.error(`Error fetching media title with id ${id}`);
        return null;
      }
    };

    // Function fetching data for Meta Info
    const mediaMeta = async () => {
      const item = response.data.data;

      // Format Status Data
      const statusFormat =
        item.attributes.status.charAt(0).toUpperCase() +
        item.attributes.status.slice(1);

      try {
        // Fetch genres data
        const genreResponse = await axios.get(
          `${API_URL}/${type}/${id}/categories`,
        );

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
          status: statusFormat || "N/A",
          avgRating: item.attributes.averageRating || "-",
          ratingRank: item.attributes.ratingRank || "-",
          userCount: item.attributes.userCount || "-",
          popularityRank: item.attributes.popularityRank || "-",
          genres: genres.join(", ") || "-",
          youtubeId: item.attributes.youtubeVideoId,
        };

        return data;
      } catch (err) {
        console.error(`Error fetch genre data! ${data.animeID}: `, err);
        return null;
      }
    };

    // Function for fetching media relation data
    const mediaRelation = async () => {
      try {
        // Fetch data for anime relation based on anime id
        const relationResponse = await axios.get(
          `${API_URL}/${type}/${id}/media-relationships`,
          {
            params: {
              "filter[role]":
                "adaptation,prequel,sequel,parent_story,side_story",
              sort: "role",
            },
          },
        );

        // Store each id and role in array object
        const relationData = relationResponse.data.data.map((item) => ({
          id: item.id,
          role: item.attributes.role,
        }));

        // Loop based on each id from relationData variable and fetch response destination
        const destinationData = await Promise.all(
          relationData.map(async (relation) => {
            try {
              const destResponse = await axios.get(
                `${API_URL}/media-relationships/${relation.id}/relationships/destination`,
              );

              const dest = destResponse.data.data;

              // Store each role, id, and type
              return {
                role: relation.role,
                id: dest.id,
                type: dest.type,
              };
            } catch (err) {
              console.error(
                `Error fetching destination for ${relation.id}: `,
                err,
              );
              return null;
            }
          }),
        );

        // Loop based on each type (manga/anime) and id from destinationData variable and fetch response anime/manga data
        const findAnimeData = await Promise.all(
          destinationData.map(async (data) => {
            try {
              const response = await axios.get(
                `${API_URL}/${data.type}/${data.id}`,
              );

              const item = response.data.data;

              // Format subtype data
              const subTypeFormat =
                item.attributes.subtype.charAt(0).toUpperCase() +
                item.attributes.subtype.slice(1);

              // Format role data
              const roleFormat =
                data.role.charAt(0).toUpperCase() +
                data.role.slice(1).replace("_", " ");

              // Save each id, type, subtype, title, poster, and role
              return {
                animeid: id,
                relationId: item.id,
                type: item.type,
                subtype: subTypeFormat,
                title: item.attributes.canonicalTitle,
                poster:
                  item.attributes.posterImage?.tiny ||
                  "/images/no-img-placeholder.webp",
                role: roleFormat,
              };
            } catch (err) {
              console.error(`Error fetching anime data for ${data.id}: `, err);
              return null;
            }
          }),
        );

        return findAnimeData;
      } catch (err) {
        console.error(`Error while fetch all media relation with id ${id}`);
        return null;
      }
    };

    // Function to fenching anime/manga characters
    const mediaCharacter = async () => {
      try {
        const characterResponse = await axios.get(
          `${API_URL}/${type}/${id}/characters`,
          {
            params: {
              "page[limit]": 6,
              sort: "role",
            },
          },
        );

        const characterIdRole = characterResponse.data.data.map((item) => ({
          id: item.id,
          role: item.attributes.role,
        }));

        const charactersData = await Promise.all(
          characterIdRole.map(async (char) => {
            try {
              const response = await axios.get(
                `${API_URL}/media-characters/${char.id}/character`,
              );

              const item = response.data.data;

              return {
                id: char.id,
                role: char.role.charAt(0).toUpperCase() + char.role.slice(1),
                name: item.attributes.canonicalName,
                japanName: item.attributes.names.ja_jp,
                otherName: item.attributes.otherName,
                description:
                  item.attributes.description ||
                  "No character description available.",
                image:
                  item.attributes.image?.original ||
                  "/images/no-img-placeholder.webp",
              };
            } catch {
              console.error(`Error fetch character data ID ${char.id}`);
              return null;
            }
          }),
        );

        return charactersData;
      } catch (err) {
        console.error(
          `Error while fetching all character data by media ID ${id}: `,
          err.message,
        );

        return null;
      }
    };

    res.render("animaku-overview", {
      mediaTitle: mediaTitle(),
      mediaMeta: await mediaMeta(),
      mediaRelation: await mediaRelation(),
      mediaCharacter: await mediaCharacter(),
    });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Oops something went wrong!" });
  }
});

export default app;
