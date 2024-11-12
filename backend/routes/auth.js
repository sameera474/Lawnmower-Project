const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require("./middleware/verifyToken"); // Ensure path is correct
const { saveHistory } = require("./controllers/historyController");

const jwt = require("jsonwebtoken");

// In-memory user database for demonstration (replace with real database in production)
const users = [];

// Use a secure JWT secret in production
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Sign Up route
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Add new user to in-memory storage
  users.push({ name, email, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Login route with JWT generation
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate JWT token with JWT_SECRET
  const token = jwt.sign(
    { email: user.email, id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Login successful", token });
});

// controllers/historyController.js
const saveHistory = (req, res) => {
  // Extract history data from request body
  const { timestamp, speed, batteryLevel, cuttingPattern, lawnArea } = req.body;
  // Perform save operation (replace with actual database operation)
  console.log("History saved:", {
    timestamp,
    speed,
    batteryLevel,
    cuttingPattern,
    lawnArea,
  });

  res.status(201).json({ message: "History data saved successfully." });
};

// Protected route to save history (requires authentication)
router.post("/history", verifyToken, saveHistory);

module.exports = router;
