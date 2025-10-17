import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios, { all } from "axios";
import pool from "./db.js";

const app = express();

// Helpers for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_URL = process.env.KITSU_API_URL;
const userId = "1";

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

  // Parameters
  let config = {
    params: {
      "filter[text]": inputSearch.toLowerCase(),
      "filter[subtype]": inputType,
      "page[limit]": 10,
    },
  };

  try {
    // Fetch media data from API with the required parameter
    const response = await axios.get(`${API_URL}/${inputCategory}`, config);

    // Store search result
    const searchResult = response.data.data.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.attributes.canonicalTitle || "N/A",
      rating: item.attributes.averageRating || "N/A",
      episode:
        item.attributes.episodeCount || item.attributes.chapterCount || "N/A",
      subType: item.attributes.subtype.toUpperCase() || "N/A",
      cover:
        item.attributes.posterImage.tiny || "/images/no-img-placeholder.webp",
      category: inputCategory,
    }));

    res.render("browse", { searchResult });
  } catch (err) {
    console.error(`ERROR LOG: ${err}`);

    res.status(500).render("error", {
      code: 500,
      error: "Internal Server Error",
      description: `Something went wrong on our side. Please try again later. ${err.message}.`,
    });
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

    res.render("character", { characterDetail });
  } catch (err) {
    console.error(`ERROR LOG: ${err}`);

    res.status(500).render("error", {
      code: 500,
      error: "Internal Server Error",
      description: `Something went wrong while fetching media character data.`,
    });
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

    // If not found in database, fetch media data from API
    if (checkMedia.rowCount === 0) {
      // DEBUG if data not found in database
      console.log(
        `Title with id ${id} not found in database, fetching data from API then insert them into database`,
      );

      // Fetch media data from API by ID
      const response = await axios.get(`${API_URL}/${type}/${id}`);

      // DEBUG: Fetch data for media title
      if (response) {
        console.log(`Success fetching media data from API with id ${id}`);
      }

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

          // DEBUG: Check if the data was inserted successfully
          if (insertTitle.rowCount > 0) {
            console.log(
              `Success inserting media title data with id ${insertTitle.rows[0].id} to database`,
            );
          } else {
            console.log(`Title with id ${data.id} already exists — skipped.`);
          }

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

          // DEBUG: Check if fetching genre data success
          if (genreResponse) {
            console.log(`Success fetching genre's data from API with id ${id}`);
          }

          // Push genres name into array
          const genres = genreResponse.data.data.map(
            (genre) => genre.attributes.title,
          );

          const data = {
            mediaId: item.id,
            subType: item.attributes.subtype.toUpperCase() || "N/A",
            ageRating: item.attributes.ageRating || "N/A",
            ageRatingGuide: item.attributes.ageRatingGuide || "N/A",
            episode: item.attributes.episodeCount || 0,
            episodeLength: item.attributes.episodeLength || 0,
            volumeCount: item.attributes.volumeCount || 0,
            chapterCount: item.attributes.chapterCount || 0,
            startDate: item.attributes.startDate,
            endDate: item.attributes.endDate,
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
            INSERT INTO meta (mediaid, subtype, agerating, ageratingguide, episode, episodelength, volumecount, chaptercount, startdate, enddate, status, avgrating, ratingrank, usercount, popularityrank, genres, youtubeid)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *
            `,
            [
              data.mediaId,
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

          // DEBUG: Check if meta data inserted successfully
          if (insertMeta.rowCount > 0) {
            console.log(
              `Success fetching meta data, inserting meta data for media with id ${insertMeta.rows[0].mediaid} to database`,
            );
          } else {
            console.log(
              `Meta data for Media ID ${data.mediaId} already exists — skipped.`,
            );
          }

          return data;
        } catch (err) {
          console.error(`Error fetch genre data! ${data.mediaId}: `, err);
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
                  mediaId: id,
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
                INSERT INTO relation (mediaid, relationid, type, subtype, title, image, role)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
                `,
                  [
                    rel.mediaId,
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

          return findAnimeData;
        } catch (err) {
          console.error(`Error while fetch all media relation with id ${id}`);
          return null;
        }
      };

      // Function to fetching media characters
      const mediaCharacter = async () => {
        try {
          // Get character role and id from API
          const characterResponse = await axios.get(
            `${API_URL}/${type}/${id}/characters`,
            {
              params: {
                "page[limit]": 6,
                sort: "role",
              },
            },
          );

          // Store each character id and role in array
          const characterIdRole = characterResponse.data.data.map((item) => ({
            id: item.id,
            role: item.attributes.role,
          }));

          // Loop to find each character data by id
          const charactersData = await Promise.all(
            characterIdRole.map(async (char) => {
              try {
                const response = await axios.get(
                  `${API_URL}/media-characters/${char.id}/character`,
                );

                const item = response.data.data;

                // Store data
                return {
                  charId: char.id,
                  mediaId: id,
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

          // Inserting media character data into database
          await Promise.all(
            charactersData.map(async (char) => {
              try {
                const query = await pool.query(
                  `
                  INSERT INTO character (charid, mediaid, slug, role, name, japanname, othernames, description, image)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                  RETURNING *
                  `,
                  [
                    char.charId,
                    char.mediaId,
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

      res.render("overview", {
        mediaTitle: await mediaTitle(),
        mediaMeta: await mediaMeta(),
        mediaRelation: await mediaRelation(),
        mediaCharacter: await mediaCharacter(),
      });
    } else {
      // DEBUG: if data found in database
      console.log(`Title found in database for ID ${id}`);

      // Function for fetch media title from database
      const mediaTitle = async () => {
        try {
          const query = await pool.query(
            `
          SELECT * FROM title
          WHERE id = $1
          `,
            [id],
          );

          // DEBUG: if success
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

      // Function for fetch media meta from database
      const mediaMeta = async () => {
        try {
          const query = await pool.query(
            `
            SELECT
                m.id,
                t.id AS mediaid,
                m.subtype,
                m.agerating,
                m.ageratingguide,
                m.episode,
                m.episodelength,
                m.volumecount,
                m.chaptercount,
                TO_CHAR(m.startdate, 'YYYY-MM-DD') AS startdate,
                TO_CHAR(m.enddate, 'YYYY-MM-DD') AS enddate,
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
                m.mediaid = t.id
            WHERE
                m.mediaid = $1

            `,
            [id],
          );

          // DEBUG: if fetch media meta success
          console.log(
            `Success fetch meta data from database with id ${query.rows[0].mediaid}`,
          );

          return query.rows[0];
        } catch {
          console.error(
            `Error while fetch meta data from database with id ${id}`,
          );

          return null;
        }
      };

      // Function for fetch media relation from database
      const mediaRelation = async () => {
        try {
          const query = await pool.query(
            `
            SELECT
                t.id AS mediaid,
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
                r.mediaid = t.id
            WHERE
                t.id = $1
            `,
            [id],
          );

          // If fetch media relation success
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

      // Function for fetch media character from database
      const mediaCharacter = async () => {
        try {
          const query = await pool.query(
            `
            SELECT
                c.charid,
                t.id AS mediaid,
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
                c.mediaid = t.id
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

      res.render("overview", {
        mediaTitle: await mediaTitle(),
        mediaMeta: await mediaMeta(),
        mediaRelation: await mediaRelation(),
        mediaCharacter: await mediaCharacter(),
      });
    }
  } catch (err) {
    console.error(`Error fetch all media data with id ${id}`);
    console.error(`ERROR LOG: ${err}`);
    res.status(500).render("error", {
      code: 500,
      error: "Internal Server Error",
      description: `Something went wrong while fetching media data. ${err.message}.`,
    });
  }
});

app.post("/overview/list-added/", async (req, res) => {
  const {
    idInput,
    typeInput,
    statusSelect,
    scoreInput,
    episodeProgress,
    volumeProgress,
    chapterProgress,

    notesInput,
  } = req.body;

  const startDate = req.body.startDate || null;
  const finishDate = req.body.finishDate || null;

  try {
    const query = {
      text: ` INSERT INTO user_list (
      userid, mediaid, mediatype, status, score,
      episode_progress, volume_progress, chapter_progress,
      start_date, finish_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      values: [
        userId,
        idInput,
        typeInput,
        statusSelect,
        scoreInput || 0,
        episodeProgress || 0,
        volumeProgress || 0,
        chapterProgress || 0,
        startDate,
        finishDate,
        notesInput,
      ],
    };

    const result = await pool.query(query);

    // DEBUG
    if (result.rows[0]) {
      console.log(`Success added to the list`);
      console.log(result.rows[0]);
    } else {
      console.log("Fail to added to the list");
    }

    res.redirect("/mylist");
  } catch (err) {
    console.error(`ERROR LOG: ${err}`);

    res.status(500).render("error", {
      code: 500,
      error: "Internal Server Error",
      description: `Something went wrong on our side. Please try again later.`,
    });
  }
});

app.get("/mylist", async (req, res) => {
  const { type, status, sort } = req.query;

  try {
    let query = `
    SELECT ul.id, ul.userid, t."type", ul.mediaid, t.title, t.image,
    ul.score, ul.status, ul.episode_progress, ul.volume_progress,
    ul.chapter_progress, ul.start_date, ul.finish_date, ul.notes
    FROM user_list ul
    JOIN title t ON ul.mediaid = t.id
    WHERE ul.userid = $1
  `;

    // Base parameters
    const params = [userId];

    // Add filters dynamically
    const conditions = [];

    if (type) {
      conditions.push(`t."type" = $${params.length + 1}`);
      params.push(type);
    }

    if (status) {
      conditions.push(`ul.status = $${params.length + 1}`);
      params.push(status);
    }

    // Add extra conditions (if any)
    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    // Add sorting
    if (sort === "score") query += " ORDER BY ul.score DESC";
    else if (sort === "title") query += " ORDER BY t.title ASC";
    else if (sort === "progress") query += " ORDER BY ul.episode_progress DESC";
    else query += " ORDER BY ul.id DESC"; // default (Date Added)

    // Execute query
    const list = await pool.query(query, params);

    res.render("list", { list: list.rows });
  } catch {
    console.error(`ERROR LOG: ${err}`);

    res.status(500).render("error", {
      code: 500,
      error: "Internal Server Error",
      description: `Something went wrong on our side. Please try again later.`,
    });
  }
});

app.get("/mylist/edit/:id", async (req, res) => {
  const id = req.params.id;

  const query = {
    text: `
      SELECT
          ul.id,
          ul.mediaid,
          ul.mediatype,
          t.title,
          t.synopsis,
          t.image,
          m.episode,
          m.volumecount,
          m.chaptercount,
          ul.score,
          ul.episode_progress,
          ul.volume_progress,
          ul.chapter_progress,
          TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
          TO_CHAR(finish_date, 'YYYY-MM-DD') AS finish_date,
          ul.notes
      FROM
          title t
      JOIN user_list ul
      ON
          t.id = ul.mediaid
      JOIN meta m
          ON t.id = m.mediaid
      WHERE ul.id = $1
    `,
    values: [id],
  };

  try {
    const result = await pool.query(query);

    // DEBUG: success get user list from database
    if (result) {
      console.log(`Success fetch user list with id ${id}`);
    }

    res.render("edit-list", { userList: result.rows[0] });
  } catch (err) {
    console.error(`ERROR LOG: ${err}`);

    res.status(500).render("error", {
      code: 500,
      error: "Internal Server Error",
      description: `Something went wrong on our side. Please try again later.`,
    });
  }
});

app.post("/mylist/edit/updated-list/:id", async (req, res) => {
  const id = req.params.id;

  const {
    statusInput,
    scoreInput,
    episodeInput,
    volumeInput,
    chapterInput,
    start_date,
    finish_date,
    notes,
  } = req.body;

  const query = {
    text: `
      UPDATE user_list
      SET
          status = $1,
          score = $2,
          episode_progress = $3,
          volume_progress = $4,
          chapter_progress = $5,
          start_date = $6,
          finish_date = $7,
          notes = $8,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `,
    values: [
      statusInput,
      scoreInput,
      episodeInput,
      volumeInput,
      chapterInput,
      start_date || null,
      finish_date || null,
      notes,
      id,
    ],
  };

  try {
    const result = await pool.query(query);

    if (result) {
      console.log(`Success update user list with id ${id}`);
    }

    res.redirect("/mylist");
  } catch (err) {
    console.error(`ERROR LOG: ${err}`);

    res.status(500).render("error", {
      code: 500,
      error: "Internal Server Error",
      description: `Something went wrong on our side. Please try again later.`,
    });
  }
});

app.post("/mylist/edit/deleted-list/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `
      DELETE
      FROM
          user_list
      WHERE
          id = $1
      RETURNING *
      `,
      [id],
    );

    if (result) {
      console.log(`Success deleted user list with id ${id}`);
      console.log(result.rows[0]);
    }

    res.redirect("/mylist");
  } catch (err) {
    console.error(`ERROR LOG: ${err}`);

    res.status(500).render("error", {
      code: 500,
      error: "Internal Server Error",
      description: `Something went wrong on our side. Please try again later.`,
    });
  }
});

app.use((req, res) => {
  res.status(404).render("error", {
    code: 404,
    error: "Page Not Found",
    description: "Sorry, we couldn’t find the page you’re looking for.",
  });
});

export default app;
