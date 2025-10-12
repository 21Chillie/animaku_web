CREATE DATABASE animaku_db;

CREATE TABLE title (
    id INT PRIMARY KEY,
    "type" VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    image TEXT,
    synopsis TEXT
);

CREATE TABLE meta (
    id SERIAL PRIMARY KEY,
    animeId INT NOT NULL,
    subType VARCHAR(50),
    ageRating VARCHAR(50),
    ageRatingGuide VARCHAR(255),
    episode INT,
    episodeLength INT,
    volumeCount INT,
    chapterCount INT,
    startDate VARCHAR(15),
    endDate VARCHAR(15),
    status VARCHAR(50),
    avgRating VARCHAR(10),
    ratingRank INT,
    userCount INT,
    popularityRank INT,
    genres TEXT,
    youtubeId TEXT,

    CONSTRAINT fk_meta_animeid
    FOREIGN KEY (animeId)
    REFERENCES title (id)
    ON DELETE CASCADE
);

CREATE TABLE relation (
    id SERIAL PRIMARY KEY,
    animeId INT NOT NULL,
    relationId INT NOT NULL,
    "type" VARCHAR(50),
    subType VARCHAR(50),
    title TEXT,
    image TEXT,
    "role" VARCHAR(50),

    CONSTRAINT fk_relation_animeid
    FOREIGN KEY (animeId)
    REFERENCES title (id)
    ON DELETE CASCADE
);

CREATE TABLE character (
    id SERIAL PRIMARY KEY,
    charId INT NOT NULL,
    animeId INT NOT NULL,
    slug TEXT,
    "role" VARCHAR(50),
    name VARCHAR(255),
    japanName VARCHAR(255),
    otherNames TEXT[],
    description TEXT,
    image TEXT,

    CONSTRAINT fk_character_animeid
    FOREIGN KEY (animeId)
    REFERENCES title (id)
    ON DELETE CASCADE
);
