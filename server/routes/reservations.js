const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// --- 1. AUTH MIDDLEWARE (To secure Admin routes) ---
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

// --- 2. REUSABLE ASYNC EMAIL FUNCTION ---
const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"L'Olive Organic Kitchen" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: `
        <div style="font-family: serif; color: #2D2926; text-align: center; padding: 40px; background-color: #FDFCF0; border: 1px solid #D4D3AC;">
          <h1 style="font-style: italic; font-size: 32px; color: #3D4828; margin-bottom: 0;">L'OLIVE</h1>
          <p style="text-transform: uppercase; font-family: sans-serif; font-size: 10px; letter-spacing: 4px; color: #6B705C; margin-top: 5px;">Organic Kitchen</p>
          <hr style="border: none; border-top: 1px solid #D4D3AC; margin: 30px 0;" />
          ${htmlContent}
          <p style="font-size: 10px; color: #999; margin-top: 40px; text-transform: uppercase; letter-spacing: 1px;">Sanctuary Records | Yerevan</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✉️ EMAIL SENT: ${toEmail}`);
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);
  }
};

// --- 3. CREATE A RESERVATION ---
router.post("/", async (req, res) => {
  try {
    const { userName, userEmail, date, time, guests, specialRequests, area } =
      req.body;

    const newReservation = new Reservation({
      userName,
      userEmail,
      date,
      time,
      guests,
      specialRequests,
      area: area || "Main Sanctuary",
      status: "pending",
    });

    await newReservation.save();

    const pendingHtml = `
      <h2 style="color: #3D4828; font-style: italic;">Welcome to the Sanctuary</h2>
      <p style="color: #6B705C;">Hello ${userName}, we have received your request. It is currently <strong>pending</strong> approval.</p>
      <div style="background-color: #fff; padding: 20px; border: 1px solid #D4D3AC; margin: 20px 0; text-align: left;">
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Guests:</strong> ${guests}</p>
      </div>
      <p style="color: #6B705C; font-size: 12px;">We will notify you shortly once confirmed.</p>
    `;

    const adminHtml = `
      <h2 style="color: #3D4828; font-style: italic;">New Manifest Entry</h2>
      <p>Guest: <strong>${userName}</strong> has requested a table.</p>
      <p>Check the Admin Panel to confirm.</p>
    `;

    // Send emails in parallel
    Promise.all([
      sendEmail(userEmail, "Reservation Received | L'Olive", pendingHtml),
      sendEmail(
        "lana.shirzad@gmail.com",
        `🌿 New Booking: ${userName}`,
        adminHtml,
      ),
    ]);

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation" });
  }
});

// --- 4. FETCH USER HISTORY ---
router.get("/my-reservations", async (req, res) => {
  try {
    const userEmail = req.query.email;
    const history = await Reservation.find({ userEmail }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// --- 5. ADMIN: GET ALL (SECURED) ---
router.get("/all", auth, async (req, res) => {
  try {
    const all = await Reservation.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: "Unauthorized or server error" });
  }
});

// --- 6. ADMIN: UPDATE STATUS (SECURED) ---
router.patch("/:id/status", auth, async (req, res) => {
  const { status } = req.body;
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    if (status === "confirmed") {
      const confirmedHtml = `
        <h2 style="color: #3D4828;">Your Table is Set</h2>
        <p>We are delighted to confirm your reservation for <strong>${reservation.date}</strong> at <strong>${reservation.time}</strong>.</p>
        <p>Your sanctuary awaits.</p>
      `;
      sendEmail(
        reservation.userEmail,
        "Confirmed | L'Olive Organic Kitchen",
        confirmedHtml,
      );
    } else if (status === "declined") {
      const declinedHtml = `
        <h2 style="color: #8B0000;">Reservation Update</h2>
        <p>We are sorry, but we cannot accommodate your request for ${reservation.date} at this time.</p>
      `;
      sendEmail(
        reservation.userEmail,
        "Reservation Update | L'Olive",
        declinedHtml,
      );
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

// --- 7. ADMIN: DELETE (SECURED) ---
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Purged from the archives." });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
