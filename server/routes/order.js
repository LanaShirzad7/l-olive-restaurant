const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

// Simple Internal Auth
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Invalid token" });
  }
};

router.post("/process", auth, async (req, res) => {
  try {
    const { totalAmount, paymentMethod } = req.body;
    const user = await User.findById(req.user.id);

    if (paymentMethod === "wallet") {
      if (user.walletBalance < totalAmount) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }
      user.walletBalance -= totalAmount;
      await new Transaction({
        userId: user._id,
        type: "order_payment",
        amount: -totalAmount,
        description: "L'Olive Harvest Purchase",
      }).save();
    }

    // 3% Cashback & Points ($1 = 10 pts)
    const cashback = totalAmount * 0.03;
    user.walletBalance += cashback;
    user.points += Math.floor(totalAmount * 10);
    await user.save();

    await new Transaction({
      userId: user._id,
      type: "cashback",
      amount: cashback,
      description: "3% Sanctuary Cashback",
    }).save();

    res.json({ walletBalance: user.walletBalance, points: user.points });
  } catch (err) {
    res.status(500).json({ msg: "Order failed" });
  }
});

module.exports = router;
