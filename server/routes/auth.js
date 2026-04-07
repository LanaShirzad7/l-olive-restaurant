const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// --- 1. NODEMAILER CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lolivekitchen@gmail.com",
    pass: "bitucnumvvgpdxfy",
  },
});

// 🎯 NEW: This checks your email connection as soon as the server starts!
transporter.verify((error, success) => {
  if (error) {
    console.log("🚨 Nodemailer Login Failed: Check your EMAIL_PASS in .env");
    console.error(error);
  } else {
    console.log("📧 Nodemailer is ready to send recovery emails!");
  }
});

// --- 2. REGISTER ROUTE ---
router.post("/register", async (req, res) => {
  console.log("📝 Registering new user:", req.body.email);
  try {
    const { name, password, email: rawEmail } = req.body;

    if (!rawEmail || !password) {
      return res.status(400).json({ msg: "Missing email or password" });
    }
    const email = rawEmail.toLowerCase().trim();

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Grant 2000 points upon creation
    user = new User({ name, email, password, points: 2000 });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        isAdmin: user.isAdmin,
      },
      msg: "Registration successful!",
    });
  } catch (err) {
    console.error("🚨 REGISTER ERROR:", err);
    res.status(500).json({ msg: "Server Error during registration" });
  }
});

// --- 3. LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  console.log("🔑 Login attempt for:", req.body.email);
  try {
    const { password, email: rawEmail } = req.body;

    if (!rawEmail || !password) {
      return res.status(400).json({ msg: "Missing email or password" });
    }
    const email = rawEmail.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("🚨 LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server Error during login" });
  }
});

// --- 4. FORGOT PASSWORD ROUTE ---
router.post("/forgot-password", async (req, res) => {
  console.log("📩 Forgot Password request for:", req.body.email);
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log("❌ User not found in database.");
      return res
        .status(200)
        .json({ msg: "🌿 Check your inbox for the recovery link!" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 Hour
    await user.save();
    console.log("🛠️ Token generated and saved to database.");

    const frontendBaseUrl =
      process.env.NODE_ENV === "production"
        ? "https://lolive.today"
        : "http://localhost:5173";

    const resetUrl = `${frontendBaseUrl}/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: `"L'Olive Kitchen" <${"lolivekitchen@gmail.com"}>`,
      subject: "L'Olive - Password Reset Request",
      html: `
        <div style="font-family: serif; padding: 20px; background-color: #FDFCF0; border: 1px solid #D4D1B8;">
          <h2 style="color: #3D4828;">🌿 Password Recovery</h2>
          <p>You requested a password reset for your L'Olive Sanctuary account.</p>
          <p>Please click the link below to set a new password.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3D4828; color: #F5F5DC; text-decoration: none; font-weight: bold; border-radius: 4px;">RESET PASSWORD</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    console.log("📧 Attempting to send email via Nodemailer...");
    await transporter.sendMail(mailOptions);
    console.log("✅ Recovery email sent successfully to:", user.email);

    res.status(200).json({ msg: "🌿 Check your inbox for the recovery link!" });
  } catch (err) {
    console.error("🚨 FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ msg: "Server error sending email." });
  }
});

// --- 5. RESET PASSWORD ROUTE ---
router.post("/reset-password/:token", async (req, res) => {
  console.log("🔄 Resetting password with token...");
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

    console.log("✅ Password successfully updated for:", user.email);
    res.json({ msg: "Success! Your password has been updated." });
  } catch (err) {
    console.error("🚨 RESET PASSWORD ERROR:", err);
    res.status(500).json({ msg: "Server error resetting password." });
  }
});

// --- 6. REDEEM POINTS ROUTE ---
router.post("/redeem-points", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.points < 100)
      return res.status(400).json({ msg: "Minimum 100 points required" });

    const conversionRate = 0.01;
    const cashValue = user.points * conversionRate;

    user.walletBalance += cashValue;
    user.points = 0;
    await user.save();

    res.json({
      msg: "Success!",
      points: user.points,
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    console.error("🚨 REDEEM ERROR:", err);
    res.status(500).json({ msg: "Redemption failed" });
  }
});

module.exports = router;
