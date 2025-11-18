const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const DB_FILE = "./database.db";
const JSON_URL = "https://data.edmonton.ca/resource/qdgm-hex6.json";
const SOURCE_NAME = "Edmonton Public Library";

const db = new sqlite3.Database(DB_FILE);

function runQuery(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

(async () => {
  try {
    const response = await axios.get(JSON_URL);
    const records = response.data;

    db.serialize(async () => {
      db.run("PRAGMA foreign_keys = ON;");

      for (const rec of records) {
        const title = rec.title || "Unknown Title";
        const authors = rec.authour || null;
        const published_date = rec.date || null;
        const release_year = published_date ? new Date(published_date).getFullYear() : null;
        const description = null;
        const rating = null;
        const genre = null;
        const page_count = null;
        const last_checked = new Date().toISOString();
        const image_url = rec.web_link?.url || null;
        const type = "book";

        try {
          // Insert into items
          const sqlItems = `
            INSERT INTO items (title, release_year, description, rating, type, image_url)
            VALUES ('${title}', '${release_year}', '${description}', ${rating}, '${type}', '${image_url}')
          `;
          const itemId = await runQuery(sqlItems);

          // Insert into books
          const sqlBooks = `
            INSERT INTO books (item_id, title, authors, description, published_date, rating, genre, page_count, last_checked, image_url)
            VALUES (${itemId}, '${title}', '${authors}', '${description}', '${published_date}', ${rating}, '${genre}', ${page_count}, '${last_checked}', '${image_url}')
          `;
          await runQuery(sqlBooks);

          // Insert into sources
          const sqlSource = `
            INSERT INTO sources (item_id, source_name)
            VALUES (${itemId}, '${SOURCE_NAME}')
          `;
          await runQuery(sqlSource);

          console.log(`Added: ${title}`);
        } catch (err) {
          console.error("Insert error:", err.message);
        }
      }

      console.log("Finished importing EPL popular books and sources.");
      db.close();
    });
  } catch (error) {
    console.error("Failed to fetch or process data:", error.message);
    db.close();
  }
})();
