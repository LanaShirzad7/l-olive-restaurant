const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// --- REGISTER ROUTE ---
router.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        walletBalance: user.walletBalance, // 🎯 Added
        isAdmin: user.isAdmin,
      },
      msg: "Registration successful!",
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error during registration" });
  }
});

// --- LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        walletBalance: user.walletBalance, // 🎯 Added
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error during login" });
  }
});

// --- 🎯 NEW: REDEEM POINTS ROUTE ---
router.post("/redeem-points", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.points < 100)
      return res.status(400).json({ msg: "Minimum 100 points required" });

    // Conversion: 100 points = $1.00
    const conversionRate = 0.01;
    const cashValue = user.points * conversionRate;

    user.walletBalance += cashValue;
    user.points = 0; // Reset points
    await user.save();

    res.json({
      msg: "Success!",
      points: user.points,
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    res.status(500).json({ msg: "Redemption failed" });
  }
});
// --- RESET PASSWORD ROUTE ---
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Token is invalid or has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      msg: "Success! Your password has been updated. You can now log in.",
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ msg: "Server error resetting password." });
  }
});

module.exports = router;
