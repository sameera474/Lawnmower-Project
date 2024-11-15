require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const historyRoutes = require("./routes/history");
const settingsRoutes = require("./routes/settings"); // Import settings route
const app = express();

const port = process.env.PORT || 5000;

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    // Connect only if not already connected
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1); // Exit if connection fails
    }
  }
};

connectDB();

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
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// API Routes
app.use("/api", authRoutes);
app.use("/api", historyRoutes);
app.use("/api", settingsRoutes); // Add settings route

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Check if a connection is already established
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// {
//   "rewrites": [{ "source": "/(.*)", "destination": "/api" }]
// }
