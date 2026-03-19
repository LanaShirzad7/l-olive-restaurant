const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  // The person making the booking
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  // Booking Details
  date: {
    type: String, // Stored as string (e.g., "2024-05-20") for easier frontend display
    required: true,
  },
  time: {
    type: String, // Stored as string (e.g., "19:00")
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  // Preferences
  specialRequests: {
    type: String,
    default: "",
  },
  area: {
    type: String,
    default: "Main Sanctuary",
  },
  // Status Logic for the Admin Panel
  status: {
    type: String,
    enum: ["pending", "confirmed", "declined"],
    default: "pending",
  },
  // Timestamp for sorting the Manifest
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
