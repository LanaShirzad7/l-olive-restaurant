const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 1. Initialize Express
const app = express();

// 2. Import Route Handlers
// 🎯 CRITICAL: These must match your filenames in the /routes folder!
const authRoutes = require("./routes/auth");
const reservationRoutes = require("./routes/reservations");
const orderRoutes = require("./routes/order");
const transactionRoutes = require("./routes/transaction");

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: [
      "https://lolive.today", // 🎯 Add your main domain
      "https://www.lolive.today", // 🎯 Add the www version
      "https://l-olive-restaurant.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());

// --- BASE ROUTE ---
app.get("/", (req, res) => {
  res.status(200).send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #FDFCF0; min-height: 100vh;">
      <h1 style="color: #2D2926;">🍃 L'Olive Organic Kitchen API</h1>
      <p style="color: #71824F; font-weight: bold;">Status: Online & Breathing</p>
    </div>
  `);
});

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);

// 🎯 YOUR ADDED LINES HERE
app.use("/api/orders", orderRoutes);
app.use("/api/transactions", transactionRoutes);

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
const PORT = process.env.PORT || 5005;

// 🎯 FIX: No "if" statement wrapper, and binding to "0.0.0.0" for Render!
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is breathing on port ${PORT}`);
});
