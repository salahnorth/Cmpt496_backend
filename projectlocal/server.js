// server.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// -------------------- USERS --------------------

// Create new user (with password hashing)
app.post("/users", async (req, res) => {
  try {
    const { username, password, age, gender } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (username, password_hash, age, gender, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    const created_at = new Date().toISOString();

    db.run(
      sql,
      [username, password_hash, age, gender, created_at],
      function (err) {
        if (err) {
          console.error("Error adding user:", err.message);
          return res.status(500).json({ error: "Error adding user" });
        }
        return res.status(201).json({ id: this.lastID, username });
      }
    );
  } catch (err) {
    console.error("Error in /users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users (avoid returning password hashes!)
app.get("/users", (req, res) => {
  const sql = "SELECT id, username, age, gender, created_at FROM users";
  db.all(sql, (err, rows) => {
    if (err) {
      console.error("Error reading users:", err);
      return res.status(500).json({ error: "Error reading users" });
    }
    res.json(rows);
  });
});

// -------------------- LOGIN --------------------

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE username = ?`;

  db.get(sql, [username], async (err, user) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Success — do not send hash back
    const { id, age, gender, username: usern, created_at } = user;
    res.json({ message: "Login successful", user: { id, usern, age, gender, created_at } });
  });
});

// -------------------- ITEMS --------------------

app.post("/items", (req, res) => {
  const { title, release_year, description, rating, type, image_url } = req.body;
  const sql = `
    INSERT INTO items (title, release_year, description, rating, type, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [title, release_year, description, rating, type, image_url], function (err) {
    if (err) {
      console.error("Error adding item:", err.message);
      return res.status(500).json({ error: "Error adding item." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/items", (req, res) => {
  db.all("SELECT * FROM items", (err, rows) => {
    if (err) {
      console.error("Error reading items:", err.message);
      return res.status(500).json({ error: "Error reading items." });
    }
    res.json(rows);
  });
});

// -------------------- FAVOURITES --------------------

app.post("/favourites", (req, res) => {
  const { user_id, item_id, created_at } = req.body;
  const sql = `
    INSERT INTO favourites (user_id, item_id, created_at)
    VALUES (?, ?, ?)
  `;
  const created = created_at || new Date().toISOString();
  db.run(sql, [user_id, item_id, created], function (err) {
    if (err) {
      console.error("Error adding favourite:", err.message);
      return res.status(500).json({ error: "Error adding favourite." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/favourites", (req, res) => {
  const sql = `
    SELECT f.id, u.username, i.title, f.created_at
    FROM favourites f
    JOIN users u ON f.user_id = u.id
    JOIN items i ON f.item_id = i.id
  `;
  db.all(sql, (err, rows) => {
    if (err) {
      console.error("Error reading favourites:", err);
      return res.status(500).json({ error: "Error reading favourites." });
    }
    res.json(rows);
  });
});

// -------------------- MOVIES --------------------

app.post("/movies", (req, res) => {
  const { title, release_year, description, rating, genre, last_checked, image_url } = req.body;
  const sql = `
    INSERT INTO movies (title, release_year, description, rating, genre, last_checked, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [title, release_year, description, rating, genre, last_checked, image_url], function (err) {
    if (err) {
      console.error("Error adding movie:", err.message);
      return res.status(500).json({ error: "Error adding movie." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/movies", (req, res) => {
  db.all("SELECT * FROM movies", (err, rows) => {
    if (err) {
      console.error("Error reading movies:", err.message);
      return res.status(500).json({ error: "Error reading movies." });
    }
    res.json(rows);
  });
});

// -------------------- BOOKS --------------------

app.post("/books", (req, res) => {
  const { title, authors, description, published_date, rating, genre, page_count, last_checked, image_url } = req.body;
  const sql = `
    INSERT INTO books (title, authors, description, published_date, rating, genre, page_count, last_checked, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [title, authors, description, published_date, rating, genre, page_count, last_checked, image_url], function (err) {
    if (err) {
      console.error("Error adding book:", err.message);
      return res.status(500).json({ error: "Error adding book." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/books", (req, res) => {
  db.all("SELECT * FROM books", (err, rows) => {
    if (err) {
      console.error("Error reading books:", err.message);
      return res.status(500).json({ error: "Error reading books." });
    }
    res.json(rows);
  });
});

// -------------------- GENRES --------------------

app.post("/genres", (req, res) => {
  const { name } = req.body;
  const sql = `INSERT INTO genres (name) VALUES (?)`;
  db.run(sql, [name], function (err) {
    if (err) {
      console.error("Error adding genre:", err.message);
      return res.status(500).json({ error: "Error adding genre." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/genres", (req, res) => {
  db.all("SELECT * FROM genres", (err, rows) => {
    if (err) {
      console.error("Error reading genres:", err.message);
      return res.status(500).json({ error: "Error reading genres." });
    }
    res.json(rows);
  });
});

// -------------------- ITEM_GENRES --------------------

app.post("/item_genres", (req, res) => {
  const { item_id, genre_id } = req.body;
  const sql = `
    INSERT INTO item_genres (item_id, genre_id)
    VALUES (?, ?)
  `;
  db.run(sql, [item_id, genre_id], function (err) {
    if (err) {
      console.error("Error adding item_genre:", err.message);
      return res.status(500).json({ error: "Error adding item_genre." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/item_genres", (req, res) => {
  db.all("SELECT * FROM item_genres", (err, rows) => {
    if (err) {
      console.error("Error reading item_genres:", err.message);
      return res.status(500).json({ error: "Error reading item_genres." });
    }
    res.json(rows);
  });
});

// -------------------- RATINGS --------------------

app.post("/ratings", (req, res) => {
  const { user_id, item_id, rating } = req.body;
  const sql = `INSERT INTO ratings (user_id, item_id, rating) VALUES (?, ?, ?)`;
  db.run(sql, [user_id, item_id, rating], function (err) {
    if (err) {
      console.error("Error adding rating:", err.message);
      return res.status(500).json({ error: "Error adding rating." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/ratings", (req, res) => {
  db.all("SELECT * FROM ratings", (err, rows) => {
    if (err) {
      console.error("Error reading ratings:", err.message);
      return res.status(500).json({ error: "Error reading ratings." });
    }
    res.json(rows);
  });
});

// -------------------- AVAILABILITY --------------------

app.post("/availability", (req, res) => {
  const { item_id, platform, price, format, status, last_checked } = req.body;
  const sql = `
    INSERT INTO availability (item_id, platform, price, format, status, last_checked)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [item_id, platform, price, format, status, last_checked], function (err) {
    if (err) {
      console.error("Error adding availability:", err.message);
      return res.status(500).json({ error: "Error adding availability." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/availability", (req, res) => {
  db.all("SELECT * FROM availability", (err, rows) => {
    if (err) {
      console.error("Error reading availability:", err.message);
      return res.status(500).json({ error: "Error reading availability." });
    }
    res.json(rows);
  });
});

// -------------------- SOURCES --------------------

app.post("/sources", (req, res) => {
  const { item_id, source_name } = req.body;
  const sql = `INSERT INTO sources (item_id, source_name) VALUES (?, ?)`;
  db.run(sql, [item_id, source_name], function (err) {
    if (err) {
      console.error("Error adding source:", err.message);
      return res.status(500).json({ error: "Error adding source." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/sources", (req, res) => {
  db.all("SELECT * FROM sources", (err, rows) => {
    if (err) {
      console.error("Error reading sources:", err.message);
      return res.status(500).json({ error: "Error reading sources." });
    }
    res.json(rows);
  });
});

// -------------------- REVIEWS --------------------

app.post("/reviews", (req, res) => {
  const { user_id, item_id, review, rating, created_at } = req.body;
  const sql = `
    INSERT INTO reviews (user_id, item_id, review, rating, created_at)
    VALUES (?, ?, ?, ?, ?)
  `;
  const created = created_at || new Date().toISOString();
  db.run(sql, [user_id, item_id, review, rating, created], function (err) {
    if (err) {
      console.error("Error adding review:", err.message);
      return res.status(500).json({ error: "Error adding review." });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get("/reviews", (req, res) => {
  const sql = `
    SELECT r.id, u.username, i.title, r.review, r.rating, r.created_at
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN items i ON r.item_id = i.id
  `;
  db.all(sql, (err, rows) => {
    if (err) {
      console.error("Error reading reviews:", err.message);
      return res.status(500).json({ error: "Error reading reviews." });
    }
    res.json(rows);
  });
});

// -------------------- RECOMMENDATIONS (JACCARD) --------------------

app.get("/recommendations/:userId", (req, res) => {
  const userId = req.params.userId;
  const sqlUserFavs = "SELECT item_id FROM favourites WHERE user_id = ?";

  db.all(sqlUserFavs, [userId], (err, userFavRows) => {
    if (err) return res.status(500).json({ error: "Error getting user favourites" });

    const userItems = userFavRows.map((r) => r.item_id);

    // NEW RULE → If user has fewer than 10 favourites, skip recommendations
    if (userItems.length < 10) {
      return res.json({
        message: "Not enough favourites to generate recommendations. Add more to improve accuracy.",
        favourites_count: userItems.length,
        recommendations: []
      });
    }

    const sqlOtherFavs = "SELECT user_id, item_id FROM favourites WHERE user_id != ?";
    db.all(sqlOtherFavs, [userId], (err, otherFavRows) => {
      if (err) return res.status(500).json({ error: "Error getting other users' favourites" });

      const otherUsersFavs = {};
      otherFavRows.forEach((r) => {
        if (!otherUsersFavs[r.user_id]) otherUsersFavs[r.user_id] = [];
        otherUsersFavs[r.user_id].push(r.item_id);
      });

      const similarityList = [];
      for (const otherUserId in otherUsersFavs) {
        const otherItems = otherUsersFavs[otherUserId];
        let sharedCount = 0;

        userItems.forEach((ui) => {
          if (otherItems.includes(ui)) sharedCount++;
        });

        const union = new Set([...userItems, ...otherItems]);
        const jaccard = sharedCount / union.size;

        similarityList.push({
          otherUserId,
          similarity: jaccard,
          items: otherItems
        });
      }

      // Sort by similarity
      similarityList.sort((a, b) => b.similarity - a.similarity);

      const recommendedItems = [];

      similarityList.forEach((sim) => {
        sim.items.forEach((itemId) => {
          if (!userItems.includes(itemId) && !recommendedItems.includes(itemId)) {
            recommendedItems.push(itemId);
          }
        });
      });

      if (recommendedItems.length === 0) {
        return res.json({ message: "No recommendations found", recommendations: [] });
      }

      const placeholders = recommendedItems.map(() => "?").join(",");
      const sqlItems = `SELECT * FROM items WHERE id IN (${placeholders})`;

      db.all(sqlItems, recommendedItems, (err, rows) => {
        if (err)
          return res.status(500).json({ error: "Error fetching recommended item details" });

        res.json({
          message: "Recommendations ready",
          favourites_count: userItems.length,
          recommendations: rows
        });
      });
    });
  });
});


// -------------------- START SERVER --------------------

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
