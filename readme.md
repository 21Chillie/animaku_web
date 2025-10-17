# Project is finished

This project is for learning purpose

## Techstack

- Node.js
- Express
- Axios
- PostgreSQL
- TailwindCSS
- EJS

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

## API

https://kitsu.docs.apiary.io/

## Project Progress — AnimaKu

#### 1. Hero Section

- [x] Complete the navigation bar
- [x] Add hero title and description

---

#### 2. Browse Anime/Manga Page

- [x] Design the page layout
- [x] Develop the page functionality
- [x] Ensure all features work properly
- [x] Implement anime search functionality

---

#### 3. Anime Overview Page

- [x] Design title and description section
- [x] Design metadata information section
- [x] Design related titles section (prequel, sequel, adaptation, etc.)
- [x] Design character list section
- [x] Design trailer section with YouTube embed
- [x] Fetch and display anime data on the overview page

---

#### 4. Character Detail Page

- [x] Design character detail layout
- [x] Fetch and display character data

---

#### 5. PostgreSQL Integration (Overview & Character Pages)

- [x] Set up the PostgreSQL database
- [x] Add caching for the overview page (check DB before API request)
- [x] Store anime/manga titles and metadata in the database
- [x] Store media relations (sequel, prequel, adaptation, etc.) in the database
- [x] Store character data in the database

---

#### 6. Add to List & My List Pages (Edit/Delete Entries)

- [x] Implement “Add to List” button functionality on the overview page
- [x] Fix null value issues
- [x] Design layout for the “My List” page
- [x] Display all relevant user list data
- [x] Implement functional filters panel
- [x] Design layout for the “Edit List” page
- [x] Enable form inputs to update user list values
- [x] Implement delete functionality for list entries

---

#### 7. Finishing Touches

- [x] Clean up and refactor code
- [x] Improve error handling
- [x] Create custom error pages for broken or invalid routes
