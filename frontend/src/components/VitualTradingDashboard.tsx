import React, { useState, useEffect } from "react";
import axios from "axios";
import TradingHistory from "./TradeHistory";
import Portfolio from "./Portfolio";
import { useTrade } from "./TradeContext"; // Import context hook
import { useStockContext } from "./StockContext"; // ✅ Correct import
import Navbar from "./NavBar";
import "../App.css";

interface Stock {
  stockSymbol: string;
  marketPrice: number;
  totalAmount: number;
  quantity: number;
  time: string;
  type: "buy" | "sell";
}

interface Trade {
  stockSymbol: string;
  marketPrice: number;
  totalAmount: number;
  quantity: number;
  tradeType: "buy" | "sell";
  time: string;
}

interface Portfolio {
  userId: string;
  stocks: Stock[];
  _id?: string;  // Optional if you don’t use it
}

const VirtualTradingDashboard: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [portfolio, setPortfolio] = useState({ balance: 10000, stocks: [] });
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [stockSymbol, setStockSymbol] = useState("AAPL");
  const [userId, setUserId] = useState<string | null>(null); // ✅ Store user ID
  const { fetchTrades } = useTrade(); // Use fetchTrades from context
  const { selectedStock } = useStockContext();

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

  // const fetchUserPortfolio = async (userId: string) => {
  //   try {
  //     console.log("🔹 Fetching portfolio for user:", userId);
  //     const response = await axios.post(`http://localhost:5000/api/portfolio/update-portfolio/${userId}`);
      
  //     console.log("📌 Portfolio API Response:", response.data);
      
  //     setPortfolio(response.data || { balance: 0, stocks: [] });
  //   } catch (error) {
  //     console.error("❌ Error fetching portfolio:", error);
  //     setPortfolio({ balance: 0, stocks: [] }); // ✅ Default empty portfolio on error
  //   }
  // };

  const fetchUserPortfolio = async (userId: string) => {
    if (!userId) {
      console.error("❌ fetchUserPortfolio called with null userId");
      return;
    }
  
    try {
      console.log("🔄 Fetching updated portfolio for UserId:", userId);
  
      // const response = await axios.post(`http://localhost:5000/api/portfolio/update-portfolio/${userId}`);
      const response = await axios.get(`http://localhost:5000/api/portfolio/get-portfolio/${userId}`);
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
  
  

  const handleTrade = async () => {
    if (!userId) {
      alert("Please log in first.");
      return;
    }
    if (!selectedStock) {
      alert("Please select a stock first!");
      return;
    }
  
    const { stockSymbol, marketPrice } = selectedStock;
    const totalAmount = quantity * marketPrice;
  
    const tradeData = {
      userId,
      stockSymbol,
      marketPrice,
      totalAmount,
      quantity,
      tradeType,
      time: new Date().toISOString(),
    };
  
    console.log("🚀 Sending trade data:", tradeData);
  
    try {
      const response = await fetch(`http://localhost:5000/api/trades/save-trade/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeData),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("✅ Trade Data Saved:", result.trade);
        fetchTrades(userId); // ✅ Fetch updated trade history
  
        await fetch(`http://localhost:5000/api/portfolio/update-portfolio/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tradeData),
        });
        
      //   console.log("🔄 Fetching updated portfolio...");
      // await fetchUserPortfolio(userId); // 🔹 Pass userId correctly

      console.log("🛠️ Debug: Selected Stock Before Portfolio Fetch", selectedStock);
fetchUserPortfolio(userId);

        
      } else {
        alert("Error saving trade!");
      }
    } catch (error) {
      console.error("Trade save error:", error);
      alert("Server error!");
    }
  };
  
  

  // useEffect(() => {
  //   fetchUserPortfolio(userId);
  // }, []);


  const handleSelectStock = (symbol: string) => {
    setStockSymbol(symbol); // Update the stock symbol when a stock is selected
  };

  return (
    
    <div className="virtual-trading-container">
      
      {/* <StockSearch onSelectStock={handleSelectStock} /> */}
      {/* <h2>Virtual Trading Dashboard</h2> */}
      <div className="bal">
  Current Balance: <span>${portfolio?.balance?.toFixed(2) || "0.00"}</span>
</div>

      <div className="trade-form">
 
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <select className="select" value={tradeType} onChange={(e) => setTradeType(e.target.value as "buy" | "sell")}>
          <option  value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <button className="btn" onClick={handleTrade}>Execute Trade</button>
      </div>
      {/* <Portfolio userId={userId} /> */}

      {userId && <Portfolio portfolio={portfolio} userId={userId} />}


      
      <TradingHistory />
    </div>
  );
};

export default VirtualTradingDashboard;



