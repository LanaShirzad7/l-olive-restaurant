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
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

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
        isAdmin: user.isAdmin, // 🎯 ADDED: Sends admin status to frontend
      },
      msg: "Registration successful! Redirecting...",
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).send("Server Error during registration");
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
        isAdmin: user.isAdmin, // 🎯 ADDED: This lets the AdminDashboard stay open!
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send("Server Error during login");
  }
});

// --- FORGOT PASSWORD ROUTE ---
router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "No account found with that email." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🎯 FIXED: Uses a dynamic URL so it works on lolive.today AND localhost
    const frontendBaseUrl =
      process.env.NODE_ENV === "production"
        ? "https://lolive.today"
        : "http://localhost:5173";

    const resetUrl = `${frontendBaseUrl}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"L'Olive Kitchen" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request | L'Olive",
      html: `
        <div style="font-family: serif; color: #2D2926; text-align: center; padding: 40px; background-color: #FDFCF0; border: 1px solid #D2B48C;">
          <h1 style="font-style: italic;">L'OLIVE</h1>
          <hr style="border: none; border-top: 1px solid #D2B48C; margin: 20px 0;" />
          <p>You requested a password reset. Click the button below to choose a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #71824F; color: white; padding: 12px 25px; text-decoration: none; margin: 20px 0; font-family: sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">Reset Password</a>
          <p style="font-size: 10px; color: #8B735B;">This link will expire in 1 hour.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "A recovery link has been sent to your email." });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ msg: "Server error sending email." });
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
