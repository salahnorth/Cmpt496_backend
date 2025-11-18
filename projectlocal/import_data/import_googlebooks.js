const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const API_KEY = "AIzaSyBDCUXyu4xTNLe5Bh7JtxCiI2FvBCcp6DM";
const MAX_RESULTS = 100;
const MAX_PAGES = 20;
const db = new sqlite3.Database("./database.db");

function escapeStr(str) {
  return str ? str.replace(/'/g, "''") : "";
}

function runQuery(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

async function importCanadianBooks() {
  try {
    console.log("Fetching Canadian books from Google Books API...");

    for (let page = 0; page < MAX_PAGES; page++) {
      const startIndex = page * MAX_RESULTS;
      const url =
        `https://www.googleapis.com/books/v1/volumes?q=canada&maxResults=${MAX_RESULTS}` +
        `&startIndex=${startIndex}&key=${API_KEY}`;

      const response = await axios.get(url);
      const books = response.data.items || [];

      for (const book of books) {
        const info = book.volumeInfo || {};
        const sale = book.saleInfo || {};

        if (sale.saleability !== "FOR_SALE" || sale.country !== "CA") continue;

        const title = escapeStr(info.title || "Untitled");
        const authors = escapeStr(info.authors ? info.authors.join(", ") : "");
        const description = escapeStr(info.description || "");
        const published_date = info.publishedDate || "";
        const rating = info.averageRating || 0;
        
        // Fix genres
        const genre = info.categories && info.categories.length > 0
          ? escapeStr(info.categories.join(", "))
          : "Unknown";

        const page_count = info.pageCount || 0;
        const last_checked = new Date().toISOString();
        const image_url = info.imageLinks?.thumbnail
          ? escapeStr(info.imageLinks.thumbnail)
          : null;

        // Insert item
        const sqlItems = `
          INSERT INTO items (title, release_year, description, rating, image_url, type)
          VALUES ('${title}', '${published_date}', '${description}', '${rating}', '${image_url}', 'book')
        `;
        const itemId = await runQuery(sqlItems);

        // Insert book details
        const sqlBooks = `
          INSERT INTO books (item_id, title, authors, description, published_date, rating, genre, page_count, image_url, last_checked)
          VALUES ('${itemId}', '${title}', '${authors}', '${description}', '${published_date}', '${rating}', '${genre}', '${page_count}', '${image_url}', '${last_checked}')
        `;
        await runQuery(sqlBooks);

        // Insert source
        const sqlSource = `
          INSERT INTO sources (item_id, source_name)
          VALUES ('${itemId}', 'Google Books')
        `;
        await runQuery(sqlSource);

        console.log(`Added: ${title}`);
      }
    }

    console.log("All Canadian books imported successfully!");
    db.close();
  } catch (err) {
    console.error("Error importing books:", err.message);
    db.close();
  }
}

importCanadianBooks();
