const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const reservationRoutes = require("./routes/reservations");

const app = express();

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: ["https://l-olive-restaurant.vercel.app", "http://localhost:5173"],
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

app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🍃 Connected to L'Olive Database"))
  .catch((err) => console.error("❌ DB Error:", err.message));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});

// 🎯 CRITICAL FOR VERCEL
module.exports = app;
