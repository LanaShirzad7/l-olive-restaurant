const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// --- AUTH MIDDLEWARE ---
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};

// --- EMAIL FUNCTION ---
const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    const mailOptions = {
      from: `"L'Olive Kitchen" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: `<div style="font-family: serif; background-color: #FDFCF0; padding: 40px; border: 1px solid #D4D3AC;">${htmlContent}</div>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Error:", error.message);
  }
};

// --- CREATE RESERVATION ---
router.post("/", async (req, res) => {
  try {
    const { userName, userEmail, date, time, guests, specialRequest, area } =
      req.body;

    const newReservation = new Reservation({
      userName,
      userEmail,
      date,
      time,
      guests,
      specialRequest, // Matches frontend
      area,
      status: "pending",
    });

    await newReservation.save();

    // Parallel Emailing
    const userHtml = `<h2>Reservation Received</h2><p>Hello ${userName}, your request for ${date} at ${time} is pending.</p>`;
    sendEmail(userEmail, "Reservation Received | L'Olive", userHtml);
    sendEmail(
      "lana.shirzad@gmail.com",
      "New Booking Request",
      `New entry from ${userName}`,
    );

    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Backend Post Error:", error);
    res.status(500).json({ message: "Error creating reservation" });
  }
});

// --- FETCH USER HISTORY (For Dashboard) ---
router.get("/my-reservations", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ msg: "Email required" });

    const history = await Reservation.find({ userEmail: email }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// Admin Routes
router.get("/all", auth, async (req, res) => {
  try {
    const all = await Reservation.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: "Unauthorized" });
  }
});

module.exports = router;
