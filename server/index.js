const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 1. Import your custom routes
const authRoutes = require("./routes/auth");
const reservationRoutes = require("./routes/reservations");

const app = express();

// --- MIDDLEWARE ---
// 🎯 CORS is fixed here to include lolive.today!
app.use(
  cors({
    origin: [
      "https://lolive.today",
      "https://www.lolive.today",
      "https://l-olive-restaurant.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());

// --- ROUTES ---
app.get("/", (req, res) => {
  res.status(200).send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #F5F5DC; min-height: 100vh;">
      <h1 style="color: #2D2926;">🍃 L'Olive Organic Kitchen API</h1>
      <p style="color: #8B735B;">Status: Online & Connected</p>
    </div>
  `);
});

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🍃 Connected to L'Olive Database on MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });

// --- SERVER LISTENER ---
// Vercel uses its own port, so process.env.PORT is crucial here
const PORT = process.env.PORT || 5005;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is breathing on port ${PORT}`);
  });
}

// 🎯 Export the app for Vercel
module.exports = app;
