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
    timeout: 2000,
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

// Routes Character Overview
app.get("/overview/character/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Get character detail data with id from database
    const getCharacterDetail = await pool.query(
      `
      SELECT
          c."name",
          c.japanname,
          c.othernames,
          c.image,
          c.description
      FROM
          "character" c
      WHERE
          c.charid = $1
      `,
      [id],
    );

    const item = getCharacterDetail.rows[0];

    // Split description into couple paragraph
    const descriptionParagraphs = item.description
      .replace(/\n\n/g, "<br><br>")
      .split(/\s{2,}|\n+/)
      .filter((p) => p.trim().length > 0);

    // Store the character detail data in to variable
    const characterDetail = {
      canonicalName: item.name,
      ja_jp: item.japanname,
      otherNames: item.othernames.join(", "),
      image: item.image,
      description: descriptionParagraphs,
    };

    res.render("animaku-character", { characterDetail });
  } catch (err) {
    res.status(500).json({ error: "No character found in database", log: err });
  }
});

// Animaku Overview Routes
app.get("/overview/:type/:id", async (req, res) => {
  // Media ID and type
  const { id, type } = req.params;

  try {
    // Check if media data by id is available in database
    const checkMedia = await pool.query(
      `
      SELECT * FROM title
      WHERE id = $1
      `,
      [id],
    );

    if (checkMedia.rowCount === 0) {
      // DEBUG
      console.log(`No title found in database for ID ${id}`);

      // Fetch media data by ID
      const response = await axios.get(`${API_URL}/${type}/${id}`);

      // Function For fetching data For Title, Poster, Synopsis
      const mediaTitle = async () => {
        try {
          const item = response.data.data;

          const data = {
            id: item.id,
            type: item.type,
            title: item.attributes.canonicalTitle || "N/A",
            image:
              item.attributes.posterImage.small ||
              "/images/no-img-placeholder.webp",
            synopsis:
              item.attributes.synopsis.replace(/\n\n/g, "<br><br>") ||
              "This anime currently does not have a synopsis available. Check back later for updates or explore other details about the series.",
          };

          // Insert data to database animaku_db title
          const insertTitle = await pool.query(
            `
            INSERT INTO title (id, type, title, image, synopsis)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id) DO NOTHING
            RETURNING *
            `,
            [data.id, data.type, data.title, data.image, data.synopsis],
          );

          // Check if the data was inserted successfully
          if (insertTitle.rowCount > 0) {
            console.log(
              `Success inserting media title data with id ${insertTitle.rows[0].id} to database`,
            );
          } else {
            console.log(`Title with id ${data.id} already exists — skipped.`);
          }

          // Debug media title fetch
          console.log(
            `Success fetching media title data from API with id ${id}`,
          );

          return data;
        } catch (err) {
          console.error(`Error fetching media title with id ${id}`);
          return null;
        }
      };

      // Function for fetching Meta Info data
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
            subType: item.attributes.subtype.toUpperCase() || "N/A",
            ageRating: item.attributes.ageRating || "N/A",
            ageRatingGuide: item.attributes.ageRatingGuide || "N/A",
            episode: item.attributes.episodeCount,
            episodeLength: item.attributes.episodeLength,
            volumeCount: item.attributes.volumeCount,
            chapterCount: item.attributes.chapterCount,
            startDate: item.attributes.startDate || "-",
            endDate: item.attributes.endDate || "-",
            status: statusFormat || "N/A",
            avgRating: item.attributes.averageRating || "-",
            ratingRank: item.attributes.ratingRank || "-",
            userCount: item.attributes.userCount || "-",
            popularityRank: item.attributes.popularityRank || "-",
            genres: genres.join(", ") || "-",
            youtubeId: item.attributes.youtubeVideoId || "-",
          };

          // Insert meta data into database
          const insertMeta = await pool.query(
            `
            INSERT INTO meta (animeid, subtype, agerating, ageratingguide, episode, episodelength, volumecount, chaptercount, startdate, enddate, status, avgrating, ratingrank, usercount, popularityrank, genres, youtubeid)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *
            `,
            [
              data.animeId,
              data.subType,
              data.ageRating,
              data.ageRatingGuide,
              data.episode,
              data.episodeLength,
              data.volumeCount,
              data.chapterCount,
              data.startDate,
              data.endDate,
              data.status,
              data.avgRating,
              data.ratingRank,
              data.userCount,
              data.popularityRank,
              data.genres,
              data.youtubeId,
            ],
          );

          // Check if meta data inserted successfully
          if (insertMeta.rowCount > 0) {
            console.log(
              `Success inserting meta data for anime ID ${insertMeta.rows[0].animeid}`,
            );
          } else {
            console.log(
              `Meta data for anime ID ${data.animeId} already exists — skipped.`,
            );
          }

          // Debug
          console.log(
            `Success fetching meta data from API with id ${data.animeId}`,
          );

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
              timeout: 1000,
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
                  animeId: id,
                  relationId: item.id,
                  type: item.type,
                  subType: subTypeFormat,
                  title: item.attributes.canonicalTitle,
                  image:
                    item.attributes.posterImage?.tiny ||
                    "/images/no-img-placeholder.webp",
                  role: roleFormat,
                };
              } catch (err) {
                console.error(
                  `Error fetching anime data for ${data.id}: `,
                  err,
                );
                return null;
              }
            }),
          );

          await Promise.all(
            findAnimeData.map(async (rel) => {
              try {
                const query = await pool.query(
                  `
                INSERT INTO relation (animeid, relationid, type, subtype, title, image, role)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
                `,
                  [
                    rel.animeId,
                    rel.relationId,
                    rel.type,
                    rel.subType,
                    rel.title,
                    rel.image,
                    rel.role,
                  ],
                );
                console.log(
                  `Success inserting relation data with ID ${query.rows[0].relationid}`,
                );
              } catch {
                console.error(
                  `Error while inserting relation data with ID ${rel.relationId}`,
                );
              }
            }),
          );

          console.log(
            `Success fetching all media relation from API with id ${id}`,
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
                  charId: char.id,
                  animeId: id,
                  slug: item.attributes.slug || "-",
                  role: char.role.charAt(0).toUpperCase() + char.role.slice(1),
                  name: item.attributes.canonicalName,
                  japanName: item.attributes.names.ja_jp || "-",
                  otherNames: item.attributes.otherNames,
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

          await Promise.all(
            charactersData.map(async (char) => {
              try {
                const query = await pool.query(
                  `
                  INSERT INTO character (charid, animeid, slug, role, name, japanname, othernames, description, image)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                  RETURNING *
                  `,
                  [
                    char.charId,
                    char.animeId,
                    char.slug,
                    char.role,
                    char.name,
                    char.japanName,
                    char.otherNames,
                    char.description,
                    char.image,
                  ],
                );

                console.log(
                  `Success inserting character data with ID ${query.rows[0].charid}`,
                );
              } catch {
                console.error(
                  `Success inserting character data with ID ${charactersData.charId}`,
                );
              }
            }),
          );

          console.log(
            `Success fetching all character data from API with id ${id}`,
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
        mediaTitle: await mediaTitle(),
        mediaMeta: await mediaMeta(),
        mediaRelation: await mediaRelation(),
        mediaCharacter: await mediaCharacter(),
      });
    } else {
      // DEBUG
      console.log(`Title found in database for ID ${id}`);

      const mediaTitle = async () => {
        try {
          const query = await pool.query(
            `
          SELECT * FROM title
          WHERE id = $1
          `,
            [id],
          );

          console.log(
            `Success fetch title data from database with id ${query.rows[0].id}`,
          );

          return query.rows[0];
        } catch {
          console.error(
            `Error while fetch title data from database with id ${id}`,
          );

          return null;
        }
      };

      const mediaMeta = async () => {
        try {
          const query = await pool.query(
            `
            SELECT
                m.id,
                t.id AS animeid,
                m.subtype,
                m.agerating,
                m.ageratingguide,
                m.episode,
                m.episodelength,
                m.volumecount,
                m.chaptercount,
                m.startdate,
                m.enddate,
                m.status,
                m.avgrating,
                m.ratingrank,
                m.usercount,
                m.popularityrank,
                m.genres,
                m.youtubeid
            FROM
                meta m
            JOIN title t
            ON
                m.animeid = t.id
            WHERE
                m.animeid = $1

            `,
            [id],
          );

          console.log(
            `Success fetch meta data from database with id ${query.rows[0].animeid}`,
          );

          return query.rows[0];
        } catch {
          console.error(
            `Error while fetch meta data from database with id ${id}`,
          );

          return null;
        }
      };

      const mediaRelation = async () => {
        try {
          const query = await pool.query(
            `
            SELECT
                t.id AS animeid,
                r.relationid,
                r."type",
                r.subtype,
                r.title,
                r.image,
                r."role"
            FROM
                relation r
            JOIN title t
            ON
                r.animeid = t.id
            WHERE
                t.id = $1
            `,
            [id],
          );

          console.log(
            `Success fetch relation data from database with id ${id}`,
          );

          return query.rows;
        } catch {
          console.error(
            `Error while fetch relation data from database with id ${id}`,
          );
          return null;
        }
      };

      const mediaCharacter = async () => {
        try {
          const query = await pool.query(
            `
            SELECT
                c.charid,
                t.id AS animeid,
                c.slug,
                c."role",
                c."name",
                c.japanname,
                c.othernames,
                c.description,
                c.image
            FROM
                "character" c
            JOIN title t
            ON
                c.animeid = t.id
            WHERE
                t.id = $1
            ORDER BY
                c.role;

            `,
            [id],
          );

          console.log(
            `Success fetch character data from database with id ${id}`,
          );

          return query.rows;
        } catch {
          console.error(
            `Error while fetch character data from database with id ${id}`,
          );

          return null;
        }
      };

      res.render("animaku-overview", {
        mediaTitle: await mediaTitle(),
        mediaMeta: await mediaMeta(),
        mediaRelation: await mediaRelation(),
        mediaCharacter: await mediaCharacter(),
      });
    }
  } catch (err) {
    console.error(`Error fetch all media data with id ${id}`);
    res.status(500).json({ error: "Oops something went wrong!" });
  }
});

app.get("/mylist", (req, res) => {
  res.render("animaku-list");
});

export default app;
