const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const API_KEY = "e4032c00b9af85e3df97f1a0f50b0e78"; // put your TMDB key here
const BASE_URL = "https://api.themoviedb.org/3";
const MAX_PAGES = 5; // total movies = 20 * MAX_PAGES
const db = new sqlite3.Database("./database.db");

async function runQuery(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err) {
        console.log("Error running query:", err.message);
        reject(err);
      } else {
        resolve(this.lastID); // returns the new row id
      }
    });
  });
}

async function importCanadianMovies() {
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=CA&sort_by=popularity.desc&page=${page}`;
      console.log(`Fetching page ${page}...`);
      const response = await axios.get(url);
      const movies = response.data.results || [];

      for (const movie of movies) {
        const title = movie.title ? movie.title.replace(/'/g, "''") : "Untitled";
        const description = movie.overview ? movie.overview.replace(/'/g, "''") : "";
        const rating = movie.vote_average || 0;
        const release_year = movie.release_date ? movie.release_date.split("-")[0] : "";
        const genre = (movie.genre_ids && movie.genre_ids.length > 0) ? movie.genre_ids.join(",") : "";
        const last_checked = new Date().toISOString();

        // insert into items table
        const sqlItems = `
          INSERT INTO items (title, release_year, description, rating)
          VALUES ('${title}', '${release_year}', '${description}', '${rating}')
        `;
        const itemId = await runQuery(sqlItems);

        // insert into movies table
        const sqlMovies = `
          INSERT INTO movies (item_id, title, release_year, description, rating, genre, last_checked)
          VALUES ('${itemId}', '${title}', '${release_year}', '${description}', '${rating}', '${genre}', '${last_checked}')
        `;
        await runQuery(sqlMovies);
      }
    }

    console.log("All Canadian movies imported!");
    db.close();
  } catch (err) {
    console.error("Error importing movies:", err.message);
    db.close();
  }
}

// run the importer
importCanadianMovies();
