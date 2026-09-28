const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());

// =========================
// Routes
// =========================

const authRoutes = require("./routes/auth.cjs");
const productRoutes = require("./routes/products.cjs");
const orderRoutes = require("./routes/orders.cjs");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// =========================
// Test Route
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "ShopEase API is running successfully 🚀",
  });
});

// =========================
// Server Configuration
// =========================

const PORT = process.env.PORT || 5000;

// =========================
// MongoDB Connection
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });