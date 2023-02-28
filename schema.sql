DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date Date,
    poster_path VARCHAR(10000),
    overview VARCHAR(10000),
    comment VARCHAR(10000)
);

