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
  db.run("INSERT INTO users (username, email, password) VALUES ('alice', 'alice@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('bob', 'bob@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('carol', 'carol@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('dave', 'dave@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('eve', 'eve@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('frank', 'frank@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('grace', 'grace@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('heidi', 'heidi@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('ivan', 'ivan@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('judy', 'judy@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('kate', 'kate@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('leo', 'leo@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('mia', 'mia@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('nick', 'nick@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('olivia', 'olivia@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('peter', 'peter@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('quinn', 'quinn@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('rachel', 'rachel@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('sam', 'sam@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('tina', 'tina@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('ursula', 'ursula@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('victor', 'victor@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('wendy', 'wendy@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('xavier', 'xavier@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('yvonne', 'yvonne@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('zach', 'zach@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('amber', 'amber@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('brian', 'brian@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('cindy', 'cindy@example.com', 'pass123')");
  db.run("INSERT INTO users (username, email, password) VALUES ('derek', 'derek@example.com', 'pass123')");

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
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('11', '1')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('12', '2')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('13', '3')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('14', '4')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('15', '5')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('16', '6')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('17', '7')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('18', '8')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('19', '9')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('20', '10')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('21', '1')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('22', '2')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('23', '3')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('24', '4')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('25', '5')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('26', '6')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('27', '7')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('28', '8')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('29', '9')");
  db.run("INSERT INTO favourites (user_id, item_id) VALUES ('30', '10')");

  // ---------------------- RATINGS ----------------------
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('1', '1', '5')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('2', '2', '4')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('3', '3', '3')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('4', '4', '2')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('5', '5', '1')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('6', '6', '5')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('7', '7', '4')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('8', '8', '3')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('9', '9', '2')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('10', '10', '1')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('11', '1', '3')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('12', '2', '4')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('13', '3', '5')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('14', '4', '2')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('15', '5', '3')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('16', '6', '4')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('17', '7', '5')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('18', '8', '1')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('19', '9', '2')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('20', '10', '3')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('21', '1', '4')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('22', '2', '5')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('23', '3', '1')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('24', '4', '2')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('25', '5', '3')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('26', '6', '4')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('27', '7', '5')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('28', '8', '1')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('29', '9', '2')");
  db.run("INSERT INTO ratings (user_id, item_id, rating) VALUES ('30', '10', '3')");

  console.log("✅ 30 users, favourites, and ratings inserted.");
});

db.close();
