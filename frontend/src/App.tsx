
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Portfolio from "./components/Portfolio";
// import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import VirtualTrading from "./pages/VirtualTrading";
import TradingHistory from "./components/TradeHistory";
import StockChart from "./components/StockChart";
import { useState, useEffect } from "react";
import axios from "axios";


function App() {
  const [userId, setUserId] = useState<string | null>(null); // ✅ Store user ID
  const [portfolio, setPortfolio] = useState({ balance: 10000, stocks: [] });

  const fetchUserPortfolio = async (userId: string) => {
    if (!userId) {
      console.error("❌ fetchUserPortfolio called with null userId");
      return;
    }
  
    try {
      console.log("🔄 Fetching updated portfolio for UserId:", userId);
  
      // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/portfolio/update-portfolio/${userId}`);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/portfolio/get-portfolio/${userId}`);
      console.log("📌 Portfolio API Response:", response.data);
  
      if (response.data && response.data.portfolio) {
        setPortfolio(response.data.portfolio); // ✅ Ensure correct data update
      } else {
        console.error("⚠️ Portfolio API response format incorrect:", response.data);
        setPortfolio({ balance: 0, stocks: [] }); // Prevent UI crash
      }
    } catch (error) {
      console.error("❌ Error fetching portfolio:", error);
    }
  };
  
  

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")?.replace(/\s/g, "");
    console.log("🆔 Retrieved UserId from LocalStorage:", storedUserId);

    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserPortfolio(storedUserId); // ✅ Fetch portfolio inside this file
    }
    else {
      console.error("❌ UserId is null! Check authentication.");
    }
  }, []);

  return (
    <Router>
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/VT" element={<VirtualTrading />} />
        <Route path="/charts" element={<StockChart />} />
        <Route path="/portfolio" element= {userId && <Portfolio portfolio={portfolio} userId={userId} />}/>
        {/* portfolio={portfolio} userId={userId}  */}
        {/* <Route path="/signup" element={<Signup />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;


