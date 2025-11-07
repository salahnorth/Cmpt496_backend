// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

// Import external API modules
const import_streaming = require("./import_streaming");
const import_tmdb = require("./import_tmdb");
const import_googlebooks = require("./import_googlebooks");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Connect to DB
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to database.db");
    db.run("PRAGMA foreign_keys = ON");
    // ---------------------- ITEMS ----------------------
    db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,               -- 'movie' or 'book'
    title TEXT,
    description TEXT,
    rating REAL,
    genre TEXT,
    image_url TEXT,
    release_year INTEGER,
    authors TEXT,
    published_date TEXT
  )
`);


    // ---------------------- MOVIES ----------------------
    db.run(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,          -- links to items.id
    title TEXT,
    release_year INTEGER,
    description TEXT,
    rating REAL,
    genre TEXT,
    image_url TEXT,
    last_checked TEXT,
    FOREIGN KEY (item_id) REFERENCES items(id)
  )
`);


    // ---------------------- BOOKS ----------------------
    db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,          -- links to items.id
    title TEXT,
    authors TEXT,
    description TEXT,
    published_date TEXT,
    rating REAL,
    genre TEXT,
    page_count INTEGER,
    last_checked TEXT,
    image_url TEXT,
    FOREIGN KEY (item_id) REFERENCES items(id)
  )
`);


    // ---------------------- USERS ----------------------
    db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    age INTEGER,
    gender TEXT,
    created_at TEXT
  )
`);


    // ---------------------- FAVOURITES ----------------------
    db.run(`
  CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
  )
`);


    // ---------------------- RATINGS ----------------------
    db.run(`
  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    rating INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
  )
`);


    // ---------------------- GENRES ----------------------
    db.run(`
  CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    genre TEXT,
    FOREIGN KEY (item_id) REFERENCES items(id)
  )
`);


    // ---------------------- SOURCES ----------------------
    db.run(`
  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    source_name TEXT,
    source_url TEXT,
    FOREIGN KEY (item_id) REFERENCES items(id)
  )
`);
  }
});
console.log("Database ready..");

require("./populate_users_data.js");

// -------------------- IMPORT DATA ON START --------------------
async function importAllData() {
  try {
    require("./import_streaming");
    require("./import_tmdb");
    require("./import_googlebooks");

    console.log("All external data imported successfully!");
  } catch (err) {
    console.error("Error importing external data:", err.message);
  }
}

// Start the import first, then start the server
importAllData();
  console.log("Starting server after import...");

// ---------------------- USERS ----------------------
app.post("/users", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const age = req.body.age;
  const gender = req.body.gender;
  const created_at = req.body.created_at;

  const sql =
    "INSERT INTO users (username, password, age, gender, created_at) VALUES ('" +
    username +
    "', '" +
    password +
    "', '" +
    age +
    "', '" +
    gender +
    "', '" +
    created_at +
    "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding user.");
    else res.send("User added!");
  });
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading users.");
    else res.send(rows);
  });
});

// ---------------------- LOGIN ----------------------
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql =
    "SELECT * FROM users WHERE username = '" + email + "' AND password = '" + password + "'";

  db.get(sql, (err, row) => {
    if (err) res.status(500).json({ message: "Database error" });
    else if (!row) res.status(401).json({ message: "Invalid credentials" });
    else res.json({ message: "Login successful", user: row });
  });
});


// ---------------------- ITEMS ----------------------
app.post("/items", (req, res) => {
  const title = req.body.title;
  const release_year = req.body.release_year;
  const description = req.body.description;
  const rating = req.body.rating;
  const type = req.body.type;
  const image_url = req.body.image_url;

  const sql =
    "INSERT INTO items (title, release_year, description, rating, type, image_url) VALUES ('" +
    title +
    "', '" +
    release_year +
    "', '" +
    description +
    "', '" +
    rating +
    "', '" +
    type +
    "', '" +
    image_url +
    "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding item.");
    else res.send("Item added!");
  });
});

app.get("/items", (req, res) => {
  const sql = "SELECT * FROM items";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading items.");
    else res.send(rows);
  });
});

// ---------------------- MOVIES ----------------------
app.post("/movies", (req, res) => {
  const title = req.body.title;
  const release_year = req.body.release_year;
  const description = req.body.description;
  const rating = req.body.rating;
  const genre = req.body.genre;
  const last_checked = req.body.last_checked;
  const image_url = req.body.image_url;

  const sql =
    "INSERT INTO movies (title, release_year, description, rating, genre, last_checked, image_url) " +
    "VALUES ('" + title + "', '" + release_year + "', '" + description + "', '" + rating + "', '" + genre + "', '" + last_checked + "', '" + image_url + "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding movie.");
    else res.send("Movie added!");
  });
});

app.get("/movies", (req, res) => {
  const sql = "SELECT * FROM movies";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading movies.");
    else res.send(rows);
  });
});

// ---------------------- BOOKS ----------------------
app.post("/books", (req, res) => {
  const title = req.body.title;
  const authors = req.body.authors;
  const description = req.body.description;
  const published_date = req.body.published_date;
  const rating = req.body.rating;
  const genre = req.body.genre;
  const page_count = req.body.page_count;
  const last_checked = req.body.last_checked;
  const image_url = req.body.image_url;

  const sql =
    "INSERT INTO books (title, authors, description, published_date, rating, genre, page_count, last_checked, image_url) " +
    "VALUES ('" + title + "', '" + authors + "', '" + description + "', '" + published_date + "', '" + rating + "', '" + genre + "', '" + page_count + "', '" +  last_checked + "', '" + image_url + "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding book.");
    else res.send("Book added!");
  });
});

app.get("/books", (req, res) => {
  const sql = "SELECT * FROM books";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading books.");
    else res.send(rows);
  });
});

// ---------------------- FAVOURITES ----------------------
app.post("/favourites", (req, res) => {
  const user_id = req.body.user_id;
  const item_id = req.body.item_id;
  const created_at = req.body.created_at;

  const sql =
    "INSERT INTO favourites (user_id, item_id, created_at) VALUES ('" +
    user_id +
    "', '" +
    item_id +
    "', '" +
    created_at +
    "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding favourite.");
    else res.send("Favourite added!");
  });
});

app.get("/favourites", (req, res) => {
  const sql =
    "SELECT favourites.id, users.username, items.title, favourites.created_at FROM favourites " +
    "JOIN users ON favourites.user_id = users.id " +
    "JOIN items ON favourites.item_id = items.id";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading favourites.");
    else res.send(rows);
  });
});

// ---------------------- REVIEWS ----------------------
app.post("/reviews", (req, res) => {
  const user_id = req.body.user_id;
  const item_id = req.body.item_id;
  const review = req.body.review;
  const rating = req.body.rating;
  const created_at = req.body.created_at;

  const sql =
    "INSERT INTO reviews (user_id, item_id, review, rating, created_at) VALUES ('" +
    user_id +
    "', '" +
    item_id +
    "', '" +
    review +
    "', '" +
    rating +
    "', '" +
    created_at +
    "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding review.");
    else res.send("Review added!");
  });
});

app.get("/reviews", (req, res) => {
  const sql =
    "SELECT reviews.id, users.username, items.title, reviews.review, reviews.rating, reviews.created_at " +
    "FROM reviews " +
    "JOIN users ON reviews.user_id = users.id " +
    "JOIN items ON reviews.item_id = items.id";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading reviews.");
    else res.send(rows);
  });
});

// ---------------------- GENRE ----------------------
app.post("/genres", (req, res) => {
  const name = req.body.name;
  const sql = "INSERT INTO genres (name) VALUES ('" + name + "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding genre.");
    else res.send("Genre added!");
  });
});

app.get("/genres", (req, res) => {
  const sql = "SELECT * FROM genres";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading genre.");
    else res.send(rows);
  });
});

// ---------------------- ITEM GENRE ----------------------
app.post("/item_genres", (req, res) => {
  const item_id = req.body.item_id;
  const genre_id = req.body.genre_id;

  const sql =
    "INSERT INTO item_genres (item_id, genre_id) VALUES ('" +
    item_id +
    "', '" +
    genre_id +
    "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding item genre.");
    else res.send("Item genre added!");
  });
});

app.get("/item_genres", (req, res) => {
  const sql = "SELECT * FROM item_genres";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading item genre.");
    else res.send(rows);
  });
});

// ---------------------- RATINGS ----------------------
app.post("/ratings", (req, res) => {
  const user_id = req.body.user_id;
  const item_id = req.body.item_id;
  const rating = req.body.rating;

  const sql =
    "INSERT INTO ratings (user_id, item_id, rating) VALUES ('" +
    user_id +
    "', '" +
    item_id +
    "', '" +
    rating +
    "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding rating.");
    else res.send("Rating added!");
  });
});

app.get("/ratings", (req, res) => {
  const sql = "SELECT * FROM ratings";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading ratings.");
    else res.send(rows);
  });
});

// ---------------------- AVAILABILITY ----------------------
app.post("/availability", (req, res) => {
  const item_id = req.body.item_id;
  const platform = req.body.platform;
  const price = req.body.price;
  const format = req.body.format;
  const status = req.body.status;
  const last_checked = req.body.last_checked;

  const sql =
    "INSERT INTO availability (item_id, platform, price, format, status, last_checked) VALUES ('" +
    item_id +
    "', '" +
    platform +
    "', '" +
    price +
    "', '" +
    format +
    "', '" +
    status +
    "', '" +
    last_checked +
    "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding availability.");
    else res.send("Availability added!");
  });
});

app.get("/availability", (req, res) => {
  const sql = "SELECT * FROM availability";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading availability.");
    else res.send(rows);
  });
});

// ---------------------- SOURCES ----------------------
app.post("/sources", (req, res) => {
  const item_id = req.body.item_id;
  const source_name = req.body.source_name;

  const sql =
    "INSERT INTO sources (item_id, source_name) VALUES ('" +
    item_id +
    "', '" +
    source_name +
    "')";
  db.run(sql, (err) => {
    if (err) res.send("Error adding source.");
    else res.send("Source added!");
  });
});

app.get("/sources", (req, res) => {
  const sql = "SELECT * FROM sources";
  db.all(sql, (err, rows) => {
    if (err) res.send("Error reading sources.");
    else res.send(rows);
  });
});

// ---------------------- LIBRARY (COMBINED MOVIES + BOOKS) ----------------------
app.get("/library", (req, res) => {
  const sql = `
  SELECT id, title, rating, genre, image_url,
          'movie' AS type,
          release_year AS extra
  FROM movies
  UNION ALL
  SELECT id, title, rating, genre, image_url,
          'book' AS type,
          published_date AS extra
  FROM books
`;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error("Error reading library:", err.message);
      res.status(500).send("Error reading library.");
    } else {
      res.json(rows);
    }
  });
});

// ---------------------- MOVIE DETAIL ----------------------
app.get("/movies/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM movies WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error reading movie:", err.message);
      res.status(500).send("Error reading movie.");
    } else if (!row) {
      res.status(404).send("Movie not found.");
    } else {
      res.json(row);
    }
  });
});

// ---------------------- BOOK DETAIL ----------------------
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM books WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error reading book:", err.message);
      res.status(500).send("Error reading book.");
    } else if (!row) {
      res.status(404).send("Book not found.");
    } else {
      res.json(row);
    }
  });
});

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
