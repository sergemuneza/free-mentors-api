const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected..."))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Use Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/mentors", mentorRoutes);
app.use("/api/v1/sessions", sessionRoutes);
app.use("/api/v1/admin", adminRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("✅ Free Mentors API is running...");
}); 

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
