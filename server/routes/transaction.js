const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

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

router.get("/my-history", auth, async (req, res) => {
  try {
    const history = await Transaction.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: "Ledger fetch failed" });
  }
});

module.exports = router;
