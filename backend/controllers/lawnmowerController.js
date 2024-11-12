const LawnmowerData = require("../models/LawnmowerData");

// Get all data points
exports.getAllData = async (req, res) => {
  try {
    const data = await LawnmowerData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

// Add new data point
exports.addDataPoint = async (req, res) => {
  try {
    const { latitude, longitude, batteryLevel, speed } = req.body;
    const newData = new LawnmowerData({
      latitude,
      longitude,
      batteryLevel,
      speed,
    });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: "Error saving data" });
  }
};
