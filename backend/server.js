const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/calendar", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error: ", err));

// Event Schema
const eventSchema = new mongoose.Schema({
  date: Date,
  time: String,
  text: String,
  type: String
});

const Event = mongoose.model("Event", eventSchema);

// Routes

// GET events by month/year
app.get("/events", async (req, res) => {
  const { month, year } = req.query;
  const events = await Event.find({
    date: {
      $gte: new Date(`${year}-${Number(month)+1}-01`),
      $lt: new Date(`${year}-${Number(month)+2}-01`)
    }
  }).sort({ date: 1 });
  res.json(events);
});

// POST new event
app.post("/events", async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.status(201).json(newEvent);
});

// PUT update event
app.put("/events/:id", async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE event
app.delete("/events/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));