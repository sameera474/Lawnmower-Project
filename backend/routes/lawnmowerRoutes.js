const express = require("express");
const {
  getAllData,
  addDataPoint,
} = require("../controllers/lawnmowerController");
const router = express.Router();

router.get("/lawnmower-data", getAllData); // GET data
router.post("/lawnmower-data", addDataPoint); // POST new data

module.exports = router;
