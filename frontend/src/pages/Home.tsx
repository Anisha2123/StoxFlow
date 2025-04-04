
// import StockPrice from "../components/StockPrice";
import { useState } from "react";
import Dashboard from "../components/Dasboard";
import StockChart from "../components/StockChart";
import Portfolio from "../components/Portfolio";
// import TradingHistory from "../components/TradeHistory";
import Navbar from "../components/NavBar";
// import { useTrade } from "../components/TradeContext"; // Import context hook



const Home = () => {

    const stocks = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "SBIN"]; // List of NSE Stocks
    // const { fetchTrades } = useTrade(); // Use fetchTrades from context
    const [userId, setUserId] = useState(null);
 
    // useEffect(() => {
    //   const storedUserId = localStorage.getItem("userId")?.replace(/\s/g, "");
    //   console.log("🆔 Retrieved UserId from LocalStorage:", storedUserId);
    //   // Fetch userId from localStorage (or from backend)
    //   // const storedUserId = localStorage.getItem("userId");
    //   if (storedUserId) {
    //     setUserId(storedUserId);
    //   }
    // }, []);

    return (
         <div>
          <Navbar />
      <Dashboard />
      <StockChart/>
      
       {/* <TradingHistory /> */}
    </div>
    )
   
  };
  
  export default Home;
  