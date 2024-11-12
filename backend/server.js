// server.js
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/verifyToken"); // Ensure correct path to middleware
const app = express();

const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// Define History Schema and Model
const historySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  speed: Number,
  batteryLevel: Number,
  cuttingPattern: String,
  lawnArea: [[Number]],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const History = mongoose.model("History", historySchema);

// Signup Endpoint
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login Endpoint with JWT
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Save History Endpoint (requires authentication)
app.post("/api/history", verifyToken, async (req, res) => {
  const { speed, batteryLevel, cuttingPattern, lawnArea } = req.body;
  try {
    const newHistory = new History({
      speed,
      batteryLevel,
      cuttingPattern,
      lawnArea,
      userId: req.user.id,
    });
    await newHistory.save();
    res.status(201).json({ message: "History data saved successfully" });
  } catch (error) {
    console.error("Error saving history:", error);
    res.status(500).json({ message: "Error saving history data" });
  }
});

// Get History Endpoint (requires authentication)
app.get("/api/history", verifyToken, async (req, res) => {
  try {
    const historyData = await History.find({ userId: req.user.id }).sort({
      timestamp: -1,
    });
    res.json(historyData);
  } catch (error) {
    console.error("Error fetching history data:", error);
    res.status(500).json({ message: "Error fetching history data" });
  }
});

// Settings Endpoints
app.get("/api/settings", verifyToken, (req, res) => {
  res.json({
    accountName: "User",
    email: "user@example.com",
    notifications: true,
    theme: "light",
  });
});

app.post("/api/settings", verifyToken, (req, res) => {
  const { accountName, email, notifications, theme } = req.body;
  res.json({ message: "Settings saved successfully!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Clear History Endpoint (requires authentication)
app.delete("/api/history", verifyToken, async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.id });
    res.status(200).json({ message: "History cleared successfully." });
  } catch (error) {
    console.error("Error clearing history data:", error);
    res.status(500).json({ message: "Error clearing history data." });
  }
});

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local development
      "https://lawnmower-project-frontend.vercel.app", // Frontend URL in Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
