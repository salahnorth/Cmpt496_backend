const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to database.db");
  }
});

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");

  // ---------------------- USERS ----------------------
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('alice', 'pass123', 24, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('bob', 'pass123', 26, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('carol', 'pass123', 22, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('dave', 'pass123', 28, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('eve', 'pass123', 23, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('frank', 'pass123', 25, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('grace', 'pass123', 21, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('heidi', 'pass123', 27, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('ivan', 'pass123', 29, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('judy', 'pass123', 22, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('kate', 'pass123', 30, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('leo', 'pass123', 23, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('mia', 'pass123', 24, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('nick', 'pass123', 28, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('olivia', 'pass123', 26, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('peter', 'pass123', 25, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('quinn', 'pass123', 22, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('rachel', 'pass123', 23, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('sam', 'pass123', 29, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('tina', 'pass123', 24, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('ursula', 'pass123', 26, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('victor', 'pass123', 27, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('wendy', 'pass123', 23, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('xavier', 'pass123', 28, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('yvonne', 'pass123', 21, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('zach', 'pass123', 25, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('amber', 'pass123', 22, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('brian', 'pass123', 27, 'M', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('cindy', 'pass123', 23, 'F', datetime('now'))");
  db.run("INSERT INTO users (username, password, age, gender, created_at) VALUES ('derek', 'pass123', 28, 'M', datetime('now'))");

  console.log("✅ 30 users inserted with username, password, age, gender, and created_at.");

  // ---------------------- FAVOURITES ----------------------
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('1', '1')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('2', '2')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('3', '3')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('4', '4')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('5', '5')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('6', '6')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('7', '7')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('8', '8')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('9', '9')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('10', '10')");
});

db.close();
