const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  specialRequest: { type: String, default: "" }, // Fixed naming to match frontend
  area: { type: String, default: "Main Sanctuary" },
  status: {
    type: String,
    enum: ["pending", "confirmed", "declined"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
