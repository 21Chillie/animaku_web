# DEV Branch

11/11/2025 to ??

The project will be rewritten in TypeScript, with all code organized into modular structure to improve development efficiency and scalability.

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

## Todo List:

- [x] Setup project
- [x] Testing the Jikan API
- [x] Design the database

**Redesign homepage:**

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

**Overview Section**

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

- [x] Fetch trending anime and store it to database (max 200+)
- [x] Fetch top anime and store it to database (max 1000+)
- [x] Fetch top manga and store it to database (max 1000+)
- [x] Create anime table and store both anime trending and top data
- [x] Create manga table and store top manga data
- [x] Create anime and manga character table
- [x] Create anime and manga relation table
- [x] Create anime and manga recommendation table

**Filter query and params(mal_id):**

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
- [x] Tidy up and fix

---

Holy fck there so much to do ....
