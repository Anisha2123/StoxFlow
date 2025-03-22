

// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");



// // Email Transporter (Use your credentials)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "your-email@gmail.com", // Replace with your email
//     pass: "your-app-password", // Generate app password from Google
//   },
// });

// // Generate OTP
// const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// // Send OTP
// router.post("/send-otp", async (req, res) => {
//   const { email } = req.body;

//   if (!email) return res.status(400).json({ message: "Email is required" });

//   try {
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5-minute expiry

//     await User.findOneAndUpdate(
//       { email },
//       { otp, otpExpiry },
//       { upsert: true, new: true }
//     );

//     await transporter.sendMail({
//       from: "your-email@gmail.com",
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}. It expires in 5 minutes.`,
//     });

//     res.json({ message: "OTP sent successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error sending OTP", error });
//   }
// });

// // Verify OTP
// router.post("/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) return res.status(400).json({ message: "All fields required" });

//   try {
//     const user = await User.findOne({ email });

//     if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     res.json({ message: "OTP verified successfully", token: "fake-jwt-token" }); // Generate JWT in production
//   } catch (error) {
//     res.status(500).json({ message: "Error verifying OTP", error });
//   }
// });

// module.exports = router;

// vsbc mcyg xzrl utwb
// 6307255290
const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

// 🔹 Initialize Firebase Admin SDK
const serviceAccount = require("../firebaseServiceAccountKey.json"); // Your Firebase private key file
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// 📌 1. Send OTP (Handled on Frontend)

// 📌 2. Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP required" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(otp);
    res.status(200).json({ message: "OTP verified", user: decodedToken });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
});

module.exports = router;



