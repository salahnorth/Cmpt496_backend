// server.js
// Simple Express + SQLite backend for Favourites (books/movies)

// 1. Import modules
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

// 2. Create Express app
const app = express();
const PORT = 3000;

// 3. Middleware to parse JSON
app.use(express.json());

// 4. Open or create the database file
const db = new sqlite3.Database("./favourites.sqlite", function(err) {
  if (err) {
    console.log("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// 5. Make sure the table exists
db.run(`CREATE TABLE IF NOT EXISTS favourites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL
)`);

// --- ROUTES ---

// 6. GET all favourites
app.get("/favourites", function(req, res) {
  db.all("SELECT * FROM favourites", [], function(err, rows) {
    if (err) {
      res.send({ error: "Error fetching favourites: " + err.message });
    } else {
      res.send(rows); // send back all rows as JSON
    }
  });
});

// 7. POST add a new favourite
app.post("/favourites", function(req, res) {
  const title = req.body.title;
  const type = req.body.type;

  if (!title || !type) {
    res.send({ error: "Please provide both title and type (book or movie)" });
    return;
  }

  const sql = "INSERT INTO favourites (title, type) VALUES (?, ?)";
  db.run(sql, [title, type], function(err) {
    if (err) {
      res.send({ error: "Could not add favourite: " + err.message });
    } else {
      // Just confirm what was added
      res.send({ message: "Favourite added", title: title, type: type });
    }
  });
});

// 8. DELETE a favourite by id
app.delete("/favourites/:id", function(req, res) {
  const id = req.params.id;

  const sql = "DELETE FROM favourites WHERE id = ?";
  db.run(sql, [id], function(err) {
    if (err) {
      res.send({ error: "Could not delete favourite: " + err.message });
    } else {
      res.send({ message: "Favourite deleted", id: id });
    }
  });
});

// 9. Start server
app.listen(PORT, function() {
  console.log("Server running at http://localhost:" + PORT);
});
