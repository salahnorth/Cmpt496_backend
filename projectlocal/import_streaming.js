const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const API_KEY = "66c2dc1512msh0b54032f5cf514bp15affcjsn12fd4d6e4b3b";
const db = new sqlite3.Database("./database.db");

// Helper to run SQL queries
function runQuery(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err) {
        console.log("SQL Error:", err.message);
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

async function importCanadianMovies() {
  try {
    console.log("Fetching the Canadian movies from Streaming Availability API...");

    const options = {
      method: "GET",
      url: "https://streaming-availability.p.rapidapi.com/shows/search/filters",
      params: {
        country: "ca",
        services: "netflix,disney",
        show_type: "movie",
        output_language: "en",
        genres_relation: "or",
      },
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const movies = response.data.shows || [];
    console.log("Movies found:", movies.length);

    for (const movie of movies) {
      let title;
      let release_year;
      let description;
      let rating;
      let last_checked;

      if (movie.title) {
        title = movie.title.replace(/'/g, "''");
      } else {
        title = "Untitled";
      }

      if (movie.overview) {
        description = movie.overview.replace(/'/g, "''");
      } else {
        description = "";
      }

      if (movie.year) {
        release_year = movie.year.toString();
      } else {
        release_year = "";
      }

      if (movie.imdbRating) {
        rating = movie.imdbRating.toString();
      } else {
        rating = "";
      }

      last_checked = new Date().toISOString();

      const sqlItems = `
        INSERT INTO items (title, release_year, description, type)
        VALUES ('${title}', '${release_year}', '${description}', 'movie')
      `;
      const itemId = await runQuery(sqlItems);

      const sqlMovies = `
        INSERT INTO movies (item_id, title, release_year, description, rating, last_checked)
        VALUES ('${itemId}', '${title}', '${release_year}', '${description}', '${rating}', '${last_checked}')
      `;
      await runQuery(sqlMovies);

      console.log(`Added: ${title} (${release_year})`);
    }

    console.log("All Canadian movies imported successfully!");
    db.close();
  } catch (err) {
    console.error("Error importing movies:", err.response?.data || err.message);
    db.close();
  }
}

importCanadianMovies();
