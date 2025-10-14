# Project is still on development

This project is for learning purpose

## Techstack

- Node.js
- Express
- Axios
- PostgreSQL
- TailwindCSS
- EJS

## Todo List

1. Finish hero section
   - [x] Navbar section
   - [x] Hero Title and description

2. Finish browse anime/manga page
   - [x] Design the page
   - [x] Develop the page
   - [x] Page function working
   - [x] Anime result search function is finish

3. Finish anime overview page
   - [x] Design title and description layout section
   - [x] Design layout of meta info section
   - [x] Design layout of anime title relation section
   - [x] Design layout of anime character
   - [x] Design layout of anime trailer and maybe add youtube embed
   - [x] Fetch data and display to anime overview page

4. Finish Character Detail Page
   - [x] Design character layout page
   - [x] Fetch data and display it to character page

5. PostgreSQL Integration For Overview And Character Page
   - [x] Make the PostgreSQL database
   - [x] Add caching for overview page (check DB before API request)
   - [x] Store anime/manga title and metadata
   - [x] Store media relations (sequel, prequel, adaptation, etc) in database
   - [x] Store media character in database

6. Add To List And My List Page
   - [ ] Make the add to list button on overview page functioning
   - [ ] Design layout for my list page
   - [ ] Display all the related data to my list page

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
┌────────────────────┐                      ┌────────────────────────┐
│   PostgreSQL DB     │                     │    Kitsu API (Remote)  │
│ (title, meta, etc.) │                     │    https://kitsu.io/   │
└────────────────────┘                      └────────────────────────┘
```

## API

https://kitsu.docs.apiary.io/
https://docs.api.jikan.moe/
