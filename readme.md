## Table of Contents

- [Animaku Web](#animaku-web)
  - [Page List](#page-list)
  - [Improvements in v2.0.0](#improvements-in-v200)
    - [Main Goal](#main-goal)
    - [What’s New](#whats-new)
  - [Tech Stack](#tech-stack)
  - [Architecture Overview](#architecture-overview)
    - [Structure](#structure)
    - [Data Freshness](#data-freshness)
    - [Bottleneck Request Queue](#bottleneck-request-queue)
    - [Lock System](#lock-system)
    - [How It Works (Simple Flow)](#how-it-works-simple-flow)
  - [How to Set Up Locally](#how-to-set-up-locally)
  - [License](#license)

---

# Animaku Web

Animaku Web is a web application for browsing anime and manga information in a simple and organized way. Users can explore titles, read summaries, see characters, media relations, and keep a personal list of what they are watching or reading.

---

## Page List

- Home
- Overview
- Top Anime/Manga List
- Trending Anime List
- Character Overview
- Authentication (Login/Register)
- User List
- User Profile

Each page is triggers external API requests when required and stored some data from external API to database if media data not provided/available in database.

---

## Improvements in v2.0.0

### Main Goal

Version 2 focuses on rebuilding the backend to be more reliable and type-safe, making the system easier to maintain and less error-prone using typescript. The frontend has also been redesigned to provide a clearer layout and a better overall user experience.

In addition, authentication and user profile features were introduced, allowing each user to manage their own personal anime and manga lists independently.

Compared to version 1.x, this release improves how data is fetched and stored:

- Better handling of multiple users opening pages at the same time
- Reduced API errors caused by request limits
- Data freshness, make sure the data is provided is up-to-date
- Safer database writes and less error prone (hopefully)

These changes make the application more reliable under real usage.

### What’s New

- Top anime/manga and trending anime list page.
- Pagination with configurable limits and better filtering and sorting support for user and media list
- Automatic refresh of stale data based on age threshold
- Authentication system, with local username and password or Google account
- New and improve user interface with toggle dark/light theme

---

## Tech Stack

- Frontend: EJS, HTML, CSS, Javascript, TailwindCSS
- Backend: TypeScript, Node.js, Express, Axios, Bottleneck
- Database: PostgreSQL
- External Data Source: Jikan API

---

## Architecture Overview

Animaku Web follows a server-driven architecture that prioritizes data reuse, request safety, and predictable behavior under load.

### Structure

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
│   PostgreSQL DB    │                     │  JIKAN API (External)  │
│ (title, meta, etc.)│                     │   https://jikan.moe/   │
└────────────────────┘                     └────────────────────────┘
```

The server acts as the central coordinator. It decides when to serve cached data, when to refresh outdated data, when to safely request new data from the external API and render the page.

### Data Freshness

Data stored in the database has an age threshold (7-30 days). When records exceeds this threshold, it is refreshed automatically in the background. This keeps content reasonably up to date while avoiding unnecessary network requests.

### Bottleneck Request Queue

The Jikan API enforces a strict rate limit (3 request/second). To comply with this, all outgoing API requests pass through a request queue that controls how many requests can be sent per second.

This ensures:

- The server never exceeds API limits
- Traffic spikes do not cause failures
- Requests are processed in a predictable order

### Lock System

When multiple users request the same anime or manga at the same time, a lock is applied based on the media ID.

Only the first request performs the fetch. All other requests wait for it to finish and reuse the result.

This prevents:

- Duplicate API calls
- Duplicate database inserts
- Inconsistent data states

### How It Works (Simple Flow)

1. A user opens an overview anime or manga page
2. The server checks the database
3. If data exists, it is shown immediately
4. If data is missing, one request fetches it
5. Other users wait for that request
6. Data is saved and reused

---

## How to Set Up Locally

The steps below explain how to run Animaku Web on your own machine for learning or development purposes.

1. **Clone the repository**

   Download the project source code:

   `git clone https://github.com/21Chillie/animaku_web.git`

2. **Install dependencies**

   Move into the project folder and install required packages:

   `npm install`

3. **Database setup**

   Set up a PostgreSQL database (recommended name: `animaku_db`).
   Once the database is ready, execute the database setup script to create all tables required for Animaku Web to run correctly.

   `npm run build:db`

4. **Environment configuration**

   Create a `.env` file and configure the variable values like in `.env.example` files

5. **Run the project**

   I have provides several scripts depending on how you want to run the application.

   Build the project
   Compile TypeScript into JavaScript:

   ```
   npm run build
   ```

   Build Tailwind CSS
   Generate and watch the Tailwind CSS output file:

   ```
   npm run build:css
   ```

   Start the application (after build)
   Run the compiled server:

   ```
   npm start
   ```

   Or you can try:

   **Development mode**
   This starts the server with automatic reload when files change:

   Build Tailwind CSS
   Generate and watch the Tailwind CSS output file:

   ```
   npm run build:css
   ```

   and then start the server

   ```
   npm run dev
   ```

   > When you start the server, make sure the Tailwind CSS watcher is running too so style changes are reflected immediately in the browser.

---

## License

MIT License

This project was built for learning and portfolio purposes. Feel free to use the code in any way you like.
