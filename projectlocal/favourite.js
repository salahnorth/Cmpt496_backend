const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");

  // Fetch all user IDs
  db.all("SELECT id FROM users", (err, userRows) => {
    if (err) throw err;

    const userIds = userRows.map(u => u.id);
    if (userIds.length === 0) {
      console.error("No users found. Populate users before running this script.");
      return db.close();
    }

    // Fetch all item IDs
    db.all("SELECT id FROM items", (err, itemRows) => {
      if (err) throw err;

      const itemIds = itemRows.map(i => i.id);
      if (itemIds.length === 0) {
        console.error("No items found. Populate items before running this script.");
        return db.close();
      }

      const totalFavs = 1000;
      const stmt = db.prepare(
        "INSERT INTO favourites (user_id, item_id, created_at) VALUES (?, ?, ?)"
      );

      function randomPick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      for (let i = 0; i < totalFavs; i++) {
        const randomUser = randomPick(userIds);
        const randomItem = randomPick(itemIds);
        const createdAt = new Date().toISOString();

        stmt.run(randomUser, randomItem, createdAt, err => {
          if (err) console.error("Insert error:", err.message);
        });
      }

      stmt.finalize(() => {
        console.log(`Inserted ${totalFavs} random favourites successfully!`);
        db.close();
      });
    });
  });
});
