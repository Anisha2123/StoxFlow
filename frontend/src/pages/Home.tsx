
// import StockPrice from "../components/StockPrice";
import { useState, useEffect } from "react";
import Dashboard from "../components/Dasboard";
import StockChart from "../components/StockChart";
import Portfolio from "../components/Portfolio";
import TradingHistory from "../components/TradeHistory";
import Navbar from "../components/NavBar";
import axios from "axios";
// import { useTrade } from "../components/TradeContext"; // Import context hook
import "../App.css";
import { TradeProvider } from "../components/TradeContext";


const Home = () => {

    const stocks = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "SBIN"]; // List of NSE Stocks
    // const { fetchTrades } = useTrade(); // Use fetchTrades from context
    // const [userId, setUserId] = useState(null);
    const [userId, setUserId] = useState<string | null>(null); // ✅ Store user ID
    const [portfolio, setPortfolio] = useState({ balance: 10000, stocks: [] });
    // useEffect(() => {
    //   const storedUserId = localStorage.getItem("userId")?.replace(/\s/g, "");
    //   console.log("🆔 Retrieved UserId from LocalStorage:", storedUserId);
    //   // Fetch userId from localStorage (or from backend)
    //   // const storedUserId = localStorage.getItem("userId");
    //   if (storedUserId) {
    //     setUserId(storedUserId);
    //   }
    // }, []);
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
         <div className="home">
          <Navbar />
      <Dashboard />
      <StockChart hideNavbar={true} />

      <div className="port">
      {userId && <Portfolio portfolio={portfolio} userId={userId} hideNavbar={false} />
    }
      </div>
<div className="trades">
<TradeProvider>
 <TradingHistory />
 </TradeProvider>
</div>
   
    </div>
    )
   
  };
  
  export default Home;
  