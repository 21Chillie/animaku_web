# AnimaKu — Anime & Manga Tracker

**AnimaKu** is a web application built with **Node.js**, **Express**, **EJS**, **TailwindCSS**, and **PostgreSQL** that allows users to search, browse, and manage their personal anime or manga lists.
It integrates with the **Kitsu API** to fetch up-to-date anime/manga data while caching information in PostgreSQL for faster performance.

---

## Demo

![AnimaKu Preview](./demo/demo.gif)

## Features

### General

- Responsive and clean interface
- Dark-themed UI with smooth hover and transition effects
- Built with TailwindCSS and custom color palette

### Browse

- Browse and search anime or manga from the Kitsu API
- Filter results by type (anime/manga) and category
- Displays titles, scores, and cover art

### Overview Page

- Shows full details for selected titles (description, genres, ratings, episodes, characters and relations)
- Includes YouTube trailer embed and related titles section
- “Add to List” button with modal to add entries

### Character Page

- Displays characters with images, voice actors, and bio fetched from API
- Stored locally in PostgreSQL to minimize API calls

### My List

- Personalized user list with filters and sorting options
- Responsive layout — switches from table view to card view on mobile
- Edit and delete entries directly from the list page

### Edit List

- Edit entry details such as score, progress, status, start/finish date, and notes
- Includes an overview panel showing anime title, image, and synopsis

### PostgreSQL Integration

- Caching layer for anime data, characters, and relations
- Reduces redundant API calls and improves performance

---

## System Architecture Overview

```bash
               ┌──────────────────────────────┐
               │         User (Browser)       │
               │  Visit and Search /browse    │
               └──────────────┬───────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │         User (Browser)       │
               │  Visits /overview/:type/:id  │
               └──────────────┬───────────────┘
                              │
                              ▼
           ┌────────────────────────────────────┐
           │       Express.js Server (Node)     │
           │  Routes, Controllers, EJS Rendering│
           └────────────────────────────────────┘
                              │
                              │
     ┌────────────────────────────────────────────────┐
     │                                                │
     ▼                                                ▼
┌────────────────────┐                     ┌────────────────────────┐
│   PostgreSQL DB    │                     │    Kitsu API (Remote)  │
│ (title, meta, etc.)│                     │    https://kitsu.io/   │
└────────────────────┘                     └────────────────────────┘
```

---

## Tech Stack

| Category          | Technology                                 |
| ----------------- | ------------------------------------------ |
| **Backend**       | Node.js, Express.js                        |
| **Frontend**      | EJS, TailwindCSS                           |
| **Database**      | PostgreSQL                                 |
| **API Source**    | [Kitsu API](https://kitsu.docs.apiary.io/) |
| **Templating**    | EJS Views                                  |
| **Styling Tools** | TailwindCSS + Custom Theme                 |

---

## Project Structure

```bash
animaKu/
├── db/
│ └── schema.sql # PostgreSQL schema file
│
├── public/ # Static frontend assets
│ ├── css/
│ │ ├── styles.css
│ │ └── tailwind.css
│ ├── fonts/
│ ├── images/
│ └── js/
│ ├── browse.js
│ ├── modal.js
│ └── navbar.js
│
├── src/ # Server-side source code
│ ├── app.js # Express routes and middleware
│ ├── db.js # PostgreSQL database connection
│ └── server.js # App entry point
│
├── views/ # EJS templates (frontend pages)
│ ├── partials/ # Shared layout components
│ │ └── navbar.ejs
│ ├── browse.ejs
│ ├── character.ejs
│ ├── edit-list.ejs
│ ├── error.ejs
│ ├── index.ejs
│ ├── list.ejs
│ └── overview.ejs
│
├── .gitignore # Ignored files for Git
├── package.json # Node project dependencies
├── package-lock.json
└── README.md # Project documentation
```

---

# Prerequisites & Local Setup

## Prerequisites

Before running **AnimaKu** locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v22 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (v14 or later)
- [Git](https://git-scm.com/)

You’ll also need an internet connection for fetching anime/manga data from the Kitsu API.

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/21Chillie/animaku_web.git
cd animaku_web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Postgres

Create a new database named animaku, then import the schema file:

```bash
psql -U <your-username> -d <database-name> -f db/schema.sql
```

or you can use database tools like `pgAdmin` or `dbeaver` then copy all code inside `schema.sql` then run query.

### 4. Create .env File

Create a .env file in the project root and fill in your configuration (change DB_USER, DB_NAME and DB_PASS values):

```
# Server
PORT=3000

# PostgreSQL connection
DB_USER=your_database_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASS=your_password
DB_PORT=5432

#API URL
KITSU_API_URL=https://kitsu.io/api/edge/
```

### 5. Run the server

Build css first:

```bash
npm run build:css
```

then start the server:

```bash
npm start
```

Your terminal will show this:

```bash
[dotenv@17.2.3] injecting env (7) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
Server running at http://localhost:3000
```

then open your browser and visit:

```bash
http://localhost:3000
```

Now AnimaKu should be running locally. You can browse anime and manga, view overviews, and manage your personal list.

---

### Planned Improvements

- Implement **user authentication and login system**
- Add **user registration** and password encryption using bcrypt
- Add **profile page** with user statistics (total anime watched, average score, etc.)
- And many more

---

Hopefully I can work on those improvements in the future, if I’m not too lazy, haha. That’s all for now. If you find any bugs or have suggestions about the project, feel free to let me know through the [GitHub issues](https://github.com/21Chillie/animaku_web/issues) page. Your feedback would really help a lot!
