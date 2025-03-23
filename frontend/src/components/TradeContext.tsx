

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
  fetchTrades: (userId: string) => void; // ✅ Fix: Define function signature correctly
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);


  
  const fetchTrades = async (userId: string) => {
    if (!userId) {
      console.error("❌ fetchTrades was called with an undefined userId!");
      return;
    }
    const cleanUserId = userId.replace(/\s+/g, ""); // ✅ Remove spaces
    const encodedUserId = encodeURIComponent(cleanUserId); // ✅ Properly encode userId
    try {
      console.log("📢 Fetching trades for userId:", encodedUserId);
      const response = await fetch(`http://localhost:5000/api/trades/get-trades/${encodedUserId}`);
      
      console.log("📩 Raw Response:", response);

      const data = await response.json();
      console.log("📊 Parsed Data:", data);

      setTradeHistory(data); // ✅ Update trade history
    } catch (error) {
      console.error("Error fetching trade history:", error);
    }
  };
  http://localhost:5000/api/trades/get-trades/+1%20650-555-3434"

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
