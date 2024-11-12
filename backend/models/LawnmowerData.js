const mongoose = require("mongoose");

const lawnmowerDataSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  batteryLevel: { type: Number, required: true },
  speed: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LawnmowerData", lawnmowerDataSchema);
