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
    mediaId INT NOT NULL,
    subType VARCHAR(50),
    ageRating VARCHAR(50),
    ageRatingGuide VARCHAR(255),
    episode INT DEFAULT 0,
    episodeLength INT DEFAULT 0,
    volumeCount INT DEFAULT 0,
    chapterCount INT DEFAULT 0,
    startDate DATE,
    endDate DATE,
    status VARCHAR(50),
    avgRating DECIMAL(3,1),
    ratingRank INT,
    userCount INT,
    popularityRank INT,
    genres TEXT,
    youtubeId TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_meta_mediaId
    FOREIGN KEY (mediaId)
    REFERENCES title (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE relation (
    id SERIAL PRIMARY KEY,
    mediaId INT NOT NULL,
    relationId INT NOT NULL,
    "type" VARCHAR(50),
    subType VARCHAR(50),
    title TEXT,
    image TEXT,
    "role" VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_relation_mediaId
    FOREIGN KEY (mediaId)
    REFERENCES title (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE character (
    id SERIAL PRIMARY KEY,
    charId INT NOT NULL,
    mediaId INT NOT NULL,
    slug TEXT,
    "role" VARCHAR(50),
    name VARCHAR(255),
    japanName VARCHAR(255),
    otherNames TEXT[],
    description TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_character_mediaId
    FOREIGN KEY (mediaId)
    REFERENCES title (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE "user" (
id SERIAL PRIMARY KEY,
username VARCHAR(50),
email VARCHAR(255),
password_hash TEXT,
display_name VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_list (
id SERIAL PRIMARY KEY,
userId INT NOT NULL,
mediaId INT NOT NULL,
mediaType VARCHAR(20),
status VARCHAR(50),
score INT DEFAULT 0,
episode_progress INT DEFAULT 0,
volume_progress INT DEFAULT 0,
chapter_progress INT DEFAULT 0,
start_date DATE DEFAULT NULL,
finish_date DATE DEFAULT NULL,
notes TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_user_list_userid
    FOREIGN KEY (userId)
    REFERENCES "user" (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

CONSTRAINT fk_user_list_mediaid
    FOREIGN KEY (mediaId)
    REFERENCES title (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
