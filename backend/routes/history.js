const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const History = require("../models/history");
const router = express.Router();

// Save History Endpoint
router.post("/history", verifyToken, async (req, res) => {
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

// Get History Endpoint
router.get("/history", verifyToken, async (req, res) => {
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

// Clear History Endpoint
router.delete("/history", verifyToken, async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.id });
    res.status(200).json({ message: "History cleared successfully." });
  } catch (error) {
    console.error("Error clearing history data:", error);
    res.status(500).json({ message: "Error clearing history data." });
  }
});

module.exports = router;
