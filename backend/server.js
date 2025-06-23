const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
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

  const startMonth = Number(month) + 1; // month is 0-based from frontend
  const start = `${year}-${String(startMonth).padStart(2, "0")}-01`;

  // If December, go to next year's January
  const endYear = startMonth === 12 ? Number(year) + 1 : year;
  const endMonth = startMonth === 12 ? 1 : startMonth + 1;
  const end = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

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


// register endpoint
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Basic check
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email;
    const role = "user"; // Set default role manually

    const approved = false;

    db.query(
      "INSERT INTO users (username, password, role, approved) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, role, approved],
      (err, result) => {
        if (err) {
          console.error("MySQL INSERT Error:", err.sqlMessage || err);
          return res.status(500).json({ message: "Database error: " + err.sqlMessage });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (err) {
    console.error("Hashing error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint

app.post("/login", (req, res) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const username = email;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) {
      console.error("MySQL SELECT Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Raw user from DB:", user);
    
    // Send back only safe user data
    const responseUser = {
      username: user.username,
      role: user.role,
        approved: Boolean(user.approved),
    };

    res.json(responseUser); // frontend expects this

    console.log("Returned from server:", responseUser); // ✅ Correct debug log
  });
});


// approve peding users
app.get("/pending-users", (req, res) => {
  db.query("SELECT id, username FROM users WHERE approved = FALSE", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});


app.put("/approve-user/:id", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE users SET approved = TRUE WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "User approved" });
  });
});

//USERS
// Get all users
app.get("/users", (req, res) => {
  db.query("SELECT id, username, role, approved FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// Update access
app.put("/users/:id/access", (req, res) => {
  const { id } = req.params;
  const { access } = req.body;
  db.query("UPDATE users SET access = ? WHERE id = ?", [access, id], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Access updated" });
  });
});

// Delete user
app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(204).end();
  });
});


// getting all events for Dates component
app.get("/all-events", (req, res) => {
  db.query("SELECT * FROM events ORDER BY date ASC", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});