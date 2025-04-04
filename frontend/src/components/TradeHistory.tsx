import React, { useState, useEffect } from "react";
import { useTrade } from "./TradeContext"; // Import context hook
import { Trade } from "../types/types"; // Import the Trade type

interface TradingHistoryProps {
  history: Trade[]; // Use the centralized Trade type
}

const TradingHistory = () => {
  const { tradeHistory, fetchTrades } = useTrade();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchTrades(storedUserId); // Fetch only if userId exists
    } else {
      console.error("❌ userId is not found in localStorage!");
    }
  }, []);

  return (
    <div className="trading-history">
      <h2>📜 Latest Trades</h2>
      {tradeHistory.length === 0 ? (
        <p>No trades executed yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Market Price</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Type</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.map((trade) => (
              <tr key={trade._id}>
                <td>{trade.stockSymbol}</td>
                <td>${trade.marketPrice.toFixed(2)}</td>
                <td>{trade.quantity}</td>
                <td>${trade.totalAmount.toFixed(2)}</td>
                <td className={trade.tradeType === "buy" ? "buy" : "sell"}>
                  {trade.tradeType}
                </td>
                <td>{new Date(trade.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TradingHistory;

