import React, { useState, useEffect } from "react";
import axios from "axios";
import TradingHistory from "./TradeHistory";
import Portfolio from "./Portfolio";
import { useTrade } from "./TradeContext"; // Import context hook
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
  balance: number;
  stocks: Stock[];
}

const VirtualTradingDashboard: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [portfolio, setPortfolio] = useState({ balance: 10000, stocks: [] });
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [stockSymbol, setStockSymbol] = useState("AAPL");
  const [userId, setUserId] = useState<string | null>(null); // ✅ Store user ID
  const { fetchTrades } = useTrade(); // Use fetchTrades from context

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")?.replace(/\s/g, "");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserPortfolio(storedUserId); // ✅ Fetch portfolio inside this file
    }
  }, []);

  const fetchUserPortfolio = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/portfolio/update-portfolio/${userId}`);
      setPortfolio(response.data || { balance: 0, stocks: [] });
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setPortfolio({ balance: 0, stocks: [] }); // ✅ Prevent `undefined`
    }
  };

  
  
  const handleTrade = async () => {
  
    
    if (!userId) {
      alert("Please log in first.");
      return;
    }

    if (!stockSymbol) {
      alert("Please select a stock first!");
      return;
    }
  
    const marketPrice = 150; // Replace with actual fetched stock price
    const totalAmount = quantity * marketPrice;
    
    const tradeData = {
      userId, // ✅ Include userId in trade data
      stockSymbol: stockSymbol,
      marketPrice,
      totalAmount,
      quantity,
      tradeType: tradeType, // ✅ Fix: match the `Trade` interface
      time: new Date().toISOString(), // Add timestamp
    };
    console.log(
      stockSymbol,
      marketPrice,
      totalAmount,
      quantity,
      tradeType,
    );

   

  
    try {
      const response = await fetch("http://localhost:5000/api/trades/save-trade/${userId}", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeData),
      });
       
      const result = await response.json();
      if (response.ok) {
        // alert("Trade saved successfully!");
        console.log("Trade Data:", result.trade);
        fetchTrades(); // ✅ Fetch updated trade history

      
      // Update Portfolio
      await fetch(`http://localhost:5000/api/portfolio/update-portfolio/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeData),
      });

      } else {
        alert("Error saving trade!");
      }
    } catch (error) {
      console.error("Trade save error:", error);
      alert("Server error!");
    }
  };
  

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`/api/virtual-trading/portfolio/${localStorage.getItem("userId")}`);
      setPortfolio(response.data || { balance: 0, stocks: [] }); // ✅ Prevent `undefined`
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setPortfolio({ balance: 0, stocks: [] }); // ✅ Default empty portfolio on error
    }
  };

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

      {userId && <Portfolio portfolio={portfolio} />} {/* ✅ Pass portfolio as prop */}
      
      <TradingHistory history={tradeHistory} />
    </div>
  );
};

export default VirtualTradingDashboard;



