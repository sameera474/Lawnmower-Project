// routes/settings.js
const express = require("express");
const router = express.Router();

// Mock route to get settings
router.get("/settings", (req, res) => {
  res.json({
    accountName: "John Doe",
    email: "john@example.com",
    notifications: true,
    theme: "light",
  });
});

// Mock route to save settings
router.post("/settings", (req, res) => {
  const { accountName, email, notifications, theme } = req.body;
  // Save the settings in your database or update user preferences here
  res.json({ message: "Settings saved successfully" });
});

module.exports = router;
