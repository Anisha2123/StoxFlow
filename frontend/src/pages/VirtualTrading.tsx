

import React, { useState } from "react";
import StockSearch from "../components/StockSearch.tsx";
import TradingDashboard from "../components/VitualTradingDashboard.js";
import Portfolio from "../components/Portfolio.tsx";
import TradingHistory from "../components/TradeHistory.tsx";
import { TradeProvider } from "../components/TradeContext"; // ✅ Import TradeProvider


interface Trade {
  stockSymbol: string;
  marketPrice: number;
  totalAmount: number;
  quantity: number;
  time: string;
  type: "buy" | "sell";
}

const VirtualTrading = () => {
  // const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  return (
    < TradeProvider >
    <div className="trading-container">
      <StockSearch />
      <TradingDashboard />
      <Portfolio />
    </div>
    </TradeProvider>
  );
};

export default VirtualTrading;
