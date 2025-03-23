

// // +1 650-555-3434

// import React, { useState, useEffect } from "react";
// import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebaseConfig";
// import { useNavigate } from "react-router-dom";
// import "../App.css"; // Import CSS

// const Login = () => {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [verificationId, setVerificationId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//         size: "normal",
//         callback: (response) => {
//           console.log("Recaptcha verified:", response);
//         },
//         "expired-callback": () => {
//           console.log("Recaptcha expired, retrying...");
//         },
//       });
//       window.recaptchaVerifier.render();
//     }
//   }, []);

//   const handleSendOtp = async () => {
//     if (!phone.startsWith("+")) {
//       alert("Enter phone number in E.164 format (e.g., +919876543210)");
//       return;
//     }

//     try {
//       const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
//       setVerificationId(confirmation.verificationId);
//       window.confirmationResult = confirmation;
//       alert("OTP Sent!");
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       alert("Failed to send OTP: " + error.message);
//     }
//   };

//   // const handleVerifyOtp = async () => {
//   //   if (!otp || !window.confirmationResult) {
//   //     alert("Enter OTP!");
//   //     return;
//   //   }

//   //   try {
//   //     const credential = await window.confirmationResult.confirm(otp);
//   //     alert("OTP Verified! Redirecting to Home...");
//   //     navigate("/home");
//   //   } catch (error) {
//   //     console.error("Error verifying OTP:", error);
//   //     alert("Invalid OTP");
//   //   }
//   // };
//   const handleVerifyOtp = async (phoneNumber: string) => {
//     if (!otp || !window.confirmationResult) {
//       alert("Enter OTP!");
//       return;
//     }

//     try {
//       const credential = await window.confirmationResult.confirm(otp);
//       // alert("OTP Verified! Redirecting to Home...");
//       localStorage.setItem("userId", phoneNumber); // Store user ID
//       navigate("/home");
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       alert("Invalid OTP");
//     }
//   };
//   return (
//     <div className="login">
//     <div className="login-container">
//       <h2>Phone OTP Login</h2>
//       <div className="input-group">
//         <input type="text" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
//         <button className="send-btn" onClick={handleSendOtp}>
//           Send OTP
//         </button>
//       </div>

//       <div className="input-group">
//         <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
//         <button className="verify-btn" onClick={handleVerifyOtp}>
//           Verify OTP
//         </button>
//       </div>

//       <div id="recaptcha-container"></div>
//     </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import CSS

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
}

const Login: React.FC = () => {
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: (response: any) => {
          console.log("Recaptcha verified:", response);
        },
        "expired-callback": () => {
          console.log("Recaptcha expired, retrying...");
        },
      });
      window.recaptchaVerifier.render();
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Enter phone number in E.164 format (e.g., +919876543210)");
      return;
    }

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setVerificationId(confirmation.verificationId);
      window.confirmationResult = confirmation;
      alert("OTP Sent!");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP: " + error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !window.confirmationResult) {
      alert("Enter OTP!");
      return;
    }

    try {
      await window.confirmationResult.confirm(otp);
      localStorage.setItem("userId", phone); // Store user ID
      navigate("/home");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Phone OTP Login</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="send-btn" onClick={handleSendOtp}>
            Send OTP
          </button>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="verify-btn" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </div>

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;



