const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const nodemailer = require("nodemailer");

// --- REUSABLE EMAIL FUNCTION ---
const sendEmail = (toEmail, subject, htmlContent) => {
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
        <div style="font-family: serif; color: #2D2926; text-align: center; padding: 40px; background-color: #FDFCF0;">
          <h1 style="font-style: italic; font-size: 32px; color: #3D4828;">L'OLIVE</h1>
          <p style="text-transform: uppercase; font-family: sans-serif; font-size: 10px; letter-spacing: 2px; color: #6B705C;">Organic Kitchen</p>
          <hr style="border: none; border-top: 1px solid #D4D3AC; margin: 30px 0;" />
          ${htmlContent}
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("❌ EMAIL FAILED TO SEND:", error.message);
      } else {
        console.log(`✉️ EMAIL SENT SUCCESSFULLY TO: ${toEmail}`);
      }
    });
  } catch (emailErr) {
    console.log("❌ Email Setup Error:", emailErr.message);
  }
};

// 1. CREATE A RESERVATION
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      date,
      time,
      guests,
      specialRequests,
      area,
    } = req.body;

    const newReservation = new Reservation({
      userId,
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

    // 🎯 1. EMAIL TO THE GUEST
    const pendingHtml = `
      <h2 style="color: #3D4828;">Hello, ${userName}</h2>
      <p style="color: #6B705C;">We have received your request. It is currently <strong>pending</strong> admin approval.</p>
      <div style="background-color: rgba(255,255,255,0.6); padding: 20px; margin: 30px 0; border: 1px solid #D4D3AC; text-align: left;">
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Area:</strong> ${area || "Main Sanctuary"}</p>
      </div>
      <p style="color: #6B705C;">We will notify you once your table is confirmed.</p>
    `;
    sendEmail(userEmail, "Reservation Request Received | L'Olive", pendingHtml);

    // 🎯 2. EMAIL TO THE ADMIN (You)
    const adminHtml = `
      <h2 style="color: #3D4828;">A New Table Has Been Set</h2>
      <p style="color: #6B705C;">A new reservation requires your approval.</p>
      <div style="background-color: rgba(255,255,255,0.6); padding: 20px; margin: 30px 0; border: 1px solid #D4D3AC; text-align: left;">
        <p><strong>Guest:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Party Size:</strong> ${guests}</p>
        <p><strong>Sanctuary Area:</strong> ${area || "Main Sanctuary"}</p>
        <p><strong>Special Requests:</strong> ${specialRequests || "None"}</p>
      </div>
      <p style="font-size: 12px; color: #888;">Log into the L'Olive Admin Dashboard to confirm or decline.</p>
    `;
    sendEmail(
      "lana.shirzad@gmail.com",
      `🌿 New Reservation Alert: ${guests} Guests`,
      adminHtml,
    );

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: "Server error while booking." });
  }
});

// 2. FETCH USER RESERVATIONS
router.get("/my-reservations", async (req, res) => {
  try {
    const userEmail = req.query.email;
    const filter = userEmail ? { userEmail } : {};
    const history = await Reservation.find(filter).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sanctuary history" });
  }
});

// 3. ADMIN: UPDATE STATUS
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    // 🎯 If you approve the table, let the guest know!
    if (status === "confirmed") {
      const confirmedHtml = `
        <h2 style="color: #3D4828;">Table Confirmed!</h2>
        <p style="color: #6B705C;">Your sanctuary awaits on <strong>${reservation.date}</strong> at <strong>${reservation.time}</strong>.</p>
        <p style="color: #6B705C;">We look forward to hosting you.</p>
      `;
      sendEmail(
        reservation.userEmail,
        "Your Table is Reserved | L'Olive",
        confirmedHtml,
      );
    }
    // 🎯 Optional: If you decline the table
    else if (status === "declined") {
      const declinedHtml = `
        <h2 style="color: #3D4828;">Reservation Update</h2>
        <p style="color: #6B705C;">We regret to inform you that we cannot accommodate your request for <strong>${reservation.date}</strong> at <strong>${reservation.time}</strong> as our sanctuary is at full capacity.</p>
        <p style="color: #6B705C;">Please feel free to try another date.</p>
      `;
      sendEmail(
        reservation.userEmail,
        "Reservation Update | L'Olive",
        declinedHtml,
      );
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error updating status." });
  }
});

// 4. ADMIN: GET ALL
router.get("/all", async (req, res) => {
  try {
    const all = await Reservation.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all reservations" });
  }
});

// 5. ADMIN: DELETE / PURGE
router.delete("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "Reservation purged from the archives." });
  } catch (error) {
    res.status(500).json({ message: "Error purging record." });
  }
});

module.exports = router;
