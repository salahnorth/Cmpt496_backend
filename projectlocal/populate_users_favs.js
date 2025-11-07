const sqlite3 = require("sqlite3").verbose();

// Open the same database as the server
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    process.exit(1);
  }
});

// Demo users to insert
const demoUsers = [
  ["bob@example.com", "pass123", 26, "M"],
  ["carol@example.com", "pass123", 22, "F"],
  ["dave@example.com", "pass123", 28, "M"],
  ["eve@example.com", "pass123", 23, "F"],
  ["frank@example.com", "pass123", 25, "M"],
  ["grace@example.com", "pass123", 21, "F"],
  ["heidi@example.com", "pass123", 27, "F"],
  ["ivan@example.com", "pass123", 29, "M"],
  ["judy@example.com", "pass123", 22, "F"],
  ["kate@example.com", "pass123", 30, "F"],
  ["leo@example.com", "pass123", 23, "M"],
  ["mia@example.com", "pass123", 24, "F"],
  ["nick@example.com", "pass123", 28, "M"],
  ["olivia@example.com", "pass123", 26, "F"],
  ["peter@example.com", "pass123", 25, "M"],
  ["quinn@example.com", "pass123", 22, "F"],
  ["rachel@example.com", "pass123", 23, "F"],
  ["sam@example.com", "pass123", 29, "M"],
  ["tina@example.com", "pass123", 24, "F"],
  ["ursula@example.com", "pass123", 26, "F"],
  ["victor@example.com", "pass123", 27, "M"],
  ["wendy@example.com", "pass123", 23, "F"],
  ["xavier@example.com", "pass123", 28, "M"],
  ["yvonne@example.com", "pass123", 21, "F"],
  ["zach@example.com", "pass123", 25, "M"],
  ["amber@example.com", "pass123", 22, "F"],
  ["brian@example.com", "pass123", 27, "M"],
  ["cindy@example.com", "pass123", 23, "F"],
  ["derek@example.com", "pass123", 28, "M"]
];

// Insert users safely (no duplicates)
console.log("Populating demo users (INSERT OR IGNORE)...");

demoUsers.forEach(([username, password, age, gender]) => {
  db.run(
    `INSERT OR IGNORE INTO users (username, password, age, gender, created_at)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    [username, password, age, gender],
    (err) => {
      if (err) {
        console.error("Error inserting user:", username, err.message);
      }
    }
  );
});

console.log(" Demo user population complete (duplicates ignored).");

// Close DB connection after inserts
setTimeout(() => db.close(), 500);