// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// App handling JSON
app.use(express.json());

// Open/create the database file
const db = new sqlite3.Database("./favourites.sqlite");
console.log("Database ready..");

// Create table
db.run(
  "CREATE TABLE IF NOT EXISTS favourites (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "title TEXT NOT NULL," +
    "type TEXT NOT NULL" +
    ")"
);

// ---------------- ROUTES ----------------

// Show all favourites
app.get("/favourites", (req, res) => {
  const sql = "SELECT * FROM favourites";
  db.all(sql, (err, rows) => {
    if (err) {
      res.send("Error reading favourites.");
    } else {
      res.send(rows);
    }
  });
});

// Add a favourite
app.post("/favourites", (req, res) => {
  const title = req.body.title;
  const type = req.body.type;

  const sql =
    "INSERT INTO favourites (title, type) VALUES ('" +
    title +
    "', '" +
    type +
    "')";

  db.run(sql, (err) => {
    if (err) {
      res.send("Error adding favourite.");
    } else {
      res.send("Favourite added!");
    }
  });
});

// Delete a favourite
app.delete("/favourites/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM favourites WHERE id = " + id;
  db.run(sql, (err) => {
    if (err) {
      res.send("Error deleting favourite.");
    } else {
      res.send("Favourite deleted!");
    }
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});

