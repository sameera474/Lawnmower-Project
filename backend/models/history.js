const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  speed: Number,
  batteryLevel: Number,
  cuttingPattern: String,
  lawnArea: [[Number]],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("History", historySchema);
