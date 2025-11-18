// db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "database.db"),
  (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
      process.exit(1);
    } else {
      console.log("Connected to database.db");
      db.run("PRAGMA foreign_keys = ON");
    }
  }
);

module.exports = db;
