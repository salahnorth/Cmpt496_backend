const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");

  // Fetch all user IDs
  db.all("SELECT id FROM users", (err, userRows) => {
    if (err) throw err;

    const userIds = userRows.map(u => u.id);
    if (userIds.length === 0) {
      console.error("No users found. Populate users first.");
      return db.close();
    }

    // Fetch all item IDs
    db.all("SELECT id FROM items", (err, itemRows) => {
      if (err) throw err;

      const itemIds = itemRows.map(i => i.id);
      if (itemIds.length === 0) {
        console.error("No items found. Populate items first.");
        return db.close();
      }

      const totalReviews = 1000;
      const stmt = db.prepare(`
        INSERT INTO reviews (user_id, item_id, review, rating, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);

      function randomPick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      const sampleComments = [
        "Loved it!",
        "It was okay.",
        "Not bad.",
        "Didn't really enjoy this.",
        "Amazing, would recommend.",
        "Could be better.",
        "One of my favourites.",
        "Pretty mid ngl.",
        "Really impressed!",
        "Terrible experience lol."
      ];

      for (let i = 0; i < totalReviews; i++) {
        const randomUser = randomPick(userIds);
        const randomItem = randomPick(itemIds);
        
        // FIXED: always between 0 and 5
        const rating = Math.floor(Math.random() * 6); 
        
        const review = randomPick(sampleComments);
        const createdAt = new Date().toISOString();

        stmt.run(randomUser, randomItem, review, rating, createdAt, err => {
          if (err) console.error("Insert error:", err.message);
        });
      }

      stmt.finalize(() => {
        console.log(`Inserted ${totalReviews} random reviews successfully!`);
        db.close();
      });
    });
  });
});
