const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// --- TEST LINES (We will delete these later) ---
console.log("My Email is:", process.env.EMAIL_USER);
console.log("My Password is:", process.env.EMAIL_PASS ? "Loaded!" : "MISSING!");
// ----------------------------------------------

// 1. Import your custom routes
const authRoutes = require("./routes/auth");
const reservationRoutes = require("./routes/reservations");

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
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
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server is breathing on http://localhost:${PORT}`);
});
