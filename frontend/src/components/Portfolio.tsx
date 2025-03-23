


import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

interface Trade {
  stockSymbol: string;
  quantity: number;
  tradeType: "buy" | "sell";
  price: number;
  date: string;
}

const Portfolio: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await axios.get(`/api/virtual-trading/trades/${localStorage.getItem("userId")}`);
      setTrades(Array.isArray(response.data) ? response.data : []); // ✅ Ensure it's an array
    } catch (error) {
      console.error("Error fetching trades:", error);
      setTrades([]); // ✅ Prevent errors by setting an empty array
    }
  };

  return (
    <div className="portfolio-container">
      <h2>Trade History</h2>
      {trades.length > 0 ? ( // ✅ Check before mapping
        <ul>
          {trades.map((trade, index) => (
            <li key={index}>
              {trade.date}: {trade.tradeType.toUpperCase()} {trade.quantity} shares of {trade.stockSymbol} at ${trade.price.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No trades found.</p> // ✅ Show message if there are no trades
      )}
    </div>
  );
};

export default Portfolio;

