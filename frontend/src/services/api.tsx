

import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const sendOtp = async (phone: number): Promise<void> => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { phone });
    console.log("OTP sent successfully:", response.data);
  } catch (error: any) {
    console.error("Error sending OTP:", error.response?.data || error.message);
  }
};



