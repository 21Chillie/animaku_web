# Still on development for v.2.0.0

If you want see the old source code just head to branch release/v1.0.0 or click [here](https://github.com/21Chillie/animaku_web/tree/release/v1.0.0)

11/11/2025 to ??

The project will be refactor and rewritten in TypeScript, with all code organized into modular structure to improve development efficiency and scalability.

Tech Stack:
Maybe there is some minor changes.
Node.js or Bun, Express or Hono, EJS, TailwindCSS.

| Folder           | Responsibility                           | Example                |
| ---------------- | ---------------------------------------- | ---------------------- |
| **config/**      | Environment setup (e.g., DB connection)  | `database.ts`          |
| **controllers/** | Handle HTTP requests and responses       | `animeController.ts`   |
| **routes/**      | Define Express routes                    | `animeRoutes.ts`       |
| **middlewares/** | Custom middleware (logger, errors, etc.) | `errorHandler.ts`      |
| **services/**    | Business logic (API fetch, cache)        | `animeService.ts`      |
| **models/**      | Database operations                      | `animeModel.ts`        |
| **types/**       | Type definitions for data                | `anime.ts`             |
| **utils/**       | Helper functions                         | `formatters.ts`        |
| **public/**      | Static files (CSS, JS, images)           | `/css/style.css`       |
| **views/**       | EJS templates for UI                     | `anime.ejs`, `404.ejs` |

---

## About AnimaKu

AnimaKu is a web application built with Node.js, Express, EJS, TailwindCSS, and PostgreSQL that allows users to search, browse, and manage their personal anime or manga lists. It integrates with the JIKAN API to fetch up-to-date anime/manga data while caching information in PostgreSQL for faster performance.

---

## Demo

![homepage](demo/Home.webp)

![overview dark](demo/overview-dark.webp)

![overview light](demo/overview-light.webp)

---

## Todo List:

- [x] Setup project
- [x] Testing the Jikan API
- [x] Design the database

**Redesign homepage (COMPLETED)**

- [x] Navbar
- [x] Navbar logic for collapse
- [x] Toggle dark/light colors
- [x] Hero section
- [x] Popular anime section :
  - [x] Write logic for fetch data
  - [x] Write logic for storing the data
  - [x] Get the data and render for this section
- [x] Top anime section :
  - [x] Write logic for fetch data
  - [x] Write logic for storing the data
  - [x] Get the data and render for this section
- [x] Top manga section :
  - [x] Write logic for fetch data
  - [x] Write logic for storing the data
  - [x] Get the data and render for this section

**Overview Section (COMPLETED)**

- [x] Design overview section
- [x] Write logic for fetch anime data and storing to database
- [x] Write logic for fetch anime character data and storing to database
- [x] Write logic for fetch anime relation data and storing to database
- [x] Write logic for fetch anime recommendation and storing to database
- [x] Write logic for fetch manga data and storing to database
- [x] Write logic for fetch manga character data and storing to database
- [x] Write logic for fetch manga relation data and storing to database
- [x] Write logic for fetch manga recommendation and storing to database
- [x] Render all the data for overview page
- [x] Need to add ending and opening OST (or will delete that section)

**Browse Section**

- [ ] Do this

**User List**

- [ ] Do this

**Authentication**

- [ ] Do this

**Error Page**

- [ ] Do this

**API and Database:**

- [x] Fetch trending anime and store it to database
- [x] Fetch top anime and store it to database
- [x] Fetch top manga and store it to database
- [x] Create anime table and store both anime trending and top data
- [x] Create manga table and store top manga data
- [x] Fix rate limited from api
- [x] Create anime and manga character table
- [x] Create anime and manga relation table
- [x] Create anime and manga recommendation table
- [x] Create anime theme table

**Filter query and params(mal_id) (PRIORITIZE)**

- [ ] Filter query for anime table
- [ ] Filter query for manga table
- [ ] Filter query trending anime api data
- [ ] Filter query top anime api data
- [ ] Filter query top manga api data

**Typescript Type Definition**

- [x] Type definition for anime data (Database/API Response)
- [x] Type definition for character data (Database/API Response)
- [x] Type definition for relation data (Database/API Response)
- [x] Type definition for recommendation data (Database/API Response)
- [x] Type definition for anime theme data (database/api response)
- [x] Tidy up and fix

---

Holy fck there so much to do ....
