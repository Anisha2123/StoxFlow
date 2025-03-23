import React, { useState, useEffect } from "react";
import axios from "axios";
import TradingHistory from "./TradeHistory";
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
  const { fetchTrades } = useTrade(); // Use fetchTrades from context


  // Simulated Market Price (Replace with API)
  const getMarketPrice = () => Math.random() * (300 - 100) + 100;
  
  const handleTrade = async () => {
    if (!stockSymbol) {
      alert("Please select a stock first!");
      return;
    }
  
    const marketPrice = 150; // Replace with actual fetched stock price
    const totalAmount = quantity * marketPrice;
    
    const tradeData = {
      stockSymbol: stockSymbol,
      marketPrice,
      totalAmount,
      quantity,
      tradeType: tradeType, // ✅ Fix: match the `Trade` interface
      // time: new Date().toISOString(), // Add timestamp
    };
    console.log(
      stockSymbol,
      marketPrice,
      totalAmount,
      quantity,
      tradeType,
    );

   

  
    try {
      const response = await fetch("http://localhost:5000/api/trades/save-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeData),
      });
       
      const result = await response.json();
      if (response.ok) {
        // alert("Trade saved successfully!");
        console.log("Trade Data:", result.trade);
        fetchTrades(); // ✅ Fetch updated trade history

        
          // ✅ Add the trade from API response to history (ensures `_id` and `timestamp` are included)
    // setTradeHistory((prevHistory) => [result.trade, ...prevHistory]);
     

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
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <button className="btn" onClick={handleTrade}>Execute Trade</button>
      </div>
      {portfolio ? (
        <div>
          <h3>Balance: ${portfolio.balance?.toFixed(2)}</h3>
          <h3>Portfolio:</h3>
          {portfolio.stocks?.length > 0 ? ( // ✅ Safe check before accessing `.length`
            portfolio.stocks.map((stock) => (
              <p key={stock.stockSymbol}>
                {stock.stockSymbol}: {stock.quantity} shares
              </p>
            ))
          ) : (
            <p>No stocks in portfolio.</p>
          )}
        </div>
      ) : (
        <p>Loading portfolio...</p>
      )}
      <TradingHistory history={tradeHistory} />
    </div>
  );
};

export default VirtualTradingDashboard;



