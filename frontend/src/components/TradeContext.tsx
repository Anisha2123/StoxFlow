

import React, { createContext, useState, useContext, ReactNode } from "react";

interface Trade {
  _id: string;
  stockSymbol: string;
  marketPrice: number;
  totalAmount: number;
  quantity: number;
  tradeType: string;
  timestamp: string;
}

interface TradeContextType {
  tradeHistory: Trade[];
  fetchTrades: () => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);

  const fetchTrades = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/trades/get-trades");
      const data = await response.json();
      setTradeHistory(data); // ✅ Update trade history
    } catch (error) {
      console.error("Error fetching trade history:", error);
    }
  };

  return (
    <TradeContext.Provider value={{ tradeHistory, fetchTrades }}>
      {children}
    </TradeContext.Provider>
  );
};

// Custom hook to use trade context
export const useTrade = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error("useTrade must be used within a TradeProvider");
  }
  return context;
};
