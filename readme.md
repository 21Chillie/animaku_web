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

Todo List:

- [x] Setup project
- [x] Testing the Jikan API
- [x] Design the database

Redesign homepage:

- [x] Navbar
- [x] Navbar logic for collapse
- [x] Toggle dark/light colors
- [x] Hero section
- [ ] Top anime
- [ ] Popular anime this season
