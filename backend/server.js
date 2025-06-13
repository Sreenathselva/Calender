const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // change if your user is different
  password: "",        // your MySQL password
  database: "calendar"
});

db.connect((err) => {
  if (err) {
    console.log("MySQL Connection Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

// Get events by month/year
app.get("/events", (req, res) => {
  const { month, year } = req.query;
  const start = `${year}-${Number(month) + 1}-01`;
  const end = `${year}-${Number(month) + 2}-01`;

  db.query(
    "SELECT * FROM events WHERE date >= ? AND date < ? ORDER BY date ASC",
    [start, end],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

// Create new event
app.post("/events", (req, res) => {
  const { date, time, text, type } = req.body;

  db.query(
    "INSERT INTO events (date, time, text, type) VALUES (?, ?, ?, ?)",
    [date, time, text, type],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id: result.insertId, date, time, text, type });
    }
  );
});

// Update event
app.put("/events/:id", (req, res) => {
  const { date, time, text, type } = req.body;
  const id = req.params.id;

  db.query(
    "UPDATE events SET date = ?, time = ?, text = ?, type = ? WHERE id = ?",
    [date, time, text, type, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ id, date, time, text, type });
    }
  );
});

// Delete event
app.delete("/events/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM events WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(204).end();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



// Register endpoint
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role],
    (err) => {
      if (err) return res.status(500).send(err);
      res.status(201).send("User registered");
    }
  );
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send("User not found");

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).send("Incorrect password");

    const token = jwt.sign({ id: user.id, role: user.role }, "your_secret_key", { expiresIn: "1d" });
    res.json({ token, role: user.role });
  });
});