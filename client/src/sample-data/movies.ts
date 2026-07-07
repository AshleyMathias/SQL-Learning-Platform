import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE movies (movie_id INTEGER PRIMARY KEY, title TEXT, release_year INTEGER, genre TEXT, rating REAL, director TEXT);
CREATE TABLE actors (actor_id INTEGER PRIMARY KEY, name TEXT, birth_year INTEGER, nationality TEXT);
CREATE TABLE movie_cast (id INTEGER PRIMARY KEY, movie_id INTEGER, actor_id INTEGER, role_name TEXT);
`;

const dataSql = `
INSERT INTO movies VALUES (1, 'Inception', 2010, 'Sci-Fi', 8.8, 'Christopher Nolan');
INSERT INTO movies VALUES (2, 'The Dark Knight', 2008, 'Action', 9.0, 'Christopher Nolan');
INSERT INTO movies VALUES (3, 'Parasite', 2019, 'Thriller', 8.5, 'Bong Joon-ho');
INSERT INTO movies VALUES (4, 'Spirited Away', 2001, 'Animation', 8.6, 'Hayao Miyazaki');
INSERT INTO actors VALUES (1, 'Leonardo DiCaprio', 1974, 'American');
INSERT INTO actors VALUES (2, 'Christian Bale', 1974, 'British');
INSERT INTO actors VALUES (3, 'Song Kang-ho', 1967, 'Korean');
INSERT INTO movie_cast VALUES (1, 1, 1, 'Cobb');
INSERT INTO movie_cast VALUES (2, 2, 2, 'Batman');
INSERT INTO movie_cast VALUES (3, 3, 3, 'Kim Ki-taek');
`;

export const movies = createSampleDb('movies', 'Movie Database', 'Movies, actors, and cast relationships.', 'Entertainment', 'Film', schemaSql, dataSql, 3, 10);
