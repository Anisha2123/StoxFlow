

import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../App.css";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  // ✅ Setup Recaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: (response) => {
          console.log("Recaptcha verified:", response);
        },
        "expired-callback": () => {
          console.log("Recaptcha expired, retrying...");
        },
      });
      window.recaptchaVerifier.render();
    }
  };

  // ✅ Send OTP with proper phone number format
  const handleSendOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Enter phone number in E.164 format (e.g., +919876543210)");
      return;
    }

    try {
      setupRecaptcha(); // Ensure recaptcha is set up

      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      window.confirmationResult = confirmation; // ✅ Store confirmation globally
      setVerificationId(confirmation.verificationId);

      alert("OTP Sent!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP: " + error.message);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || !window.confirmationResult) {
      alert("Enter OTP!");
      return;
    }

    try {
      const credential = await window.confirmationResult.confirm(otp);
      const token = await credential.user.getIdToken();

      alert("OTP Verified! Token: " + token);
      navigate("/home"); // ✅ Redirect to Home
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <div>
      <h2>Phone OTP Login</h2>
      <div>
        <input type="text" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button onClick={handleSendOtp}>Send OTP</button>
      </div>

      <div>
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button onClick={handleVerifyOtp}>Verify OTP</button>
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;

// +1 650-555-3434
