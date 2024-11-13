require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const historyRoutes = require("./routes/history");
const app = express();

const port = process.env.PORT || 5000;

// Middleware for CORS and JSON parsing
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://lawnmower-project-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api", authRoutes); // Authentication routes
app.use("/api", historyRoutes); // History routes

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Check if a connection is already established
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
