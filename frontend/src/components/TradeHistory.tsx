


import React, { useState, useEffect } from "react";
import { useTrade } from "./TradeContext"; // Import context hook

interface Trade {
  _id: string;
  stockSymbol: string;
  marketPrice: number;
  totalAmount: number;
  quantity: number;
  tradeType: string;
  timestamp: string;
}

interface TradingHistoryProps {
  history: Trade[];
}

const TradingHistory: React. FC<TradingHistoryProps> = ({ history }) => {
    const { tradeHistory, fetchTrades } = useTrade();
   
//   useEffect(() => {
//     const fetchTrades = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/trades/get-trades");
//         const data = await response.json();
//         setTradeHistory(data); // ✅ Update trade history state
//       } catch (error) {
//         console.error("Error fetching trade history:", error);
//       }
//     };

//     fetchTrades();
//   }, []);

useEffect(() => {
    fetchTrades(); // ✅ Fetch trades on mount
  }, []);

  return (
    <div className="trading-history">
      <h2>📜 Trading History</h2>
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

