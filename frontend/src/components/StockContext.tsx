


// // StockContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from "react";

// interface Stock {
//   stockSymbol: string;
//   marketPrice: number;
// }

// interface StockContextType {
//   selectedStock: Stock | null;
//   setSelectedStock: (stock: Stock) => void;
// }

// const StockContext = createContext<StockContextType | undefined>(undefined);

// export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

//   return (
//     <StockContext.Provider value={{ selectedStock, setSelectedStock }}>
//       {children}
//     </StockContext.Provider>
//   );
// };

// // ✅ Correct: Single custom hook
// export const useStockContext = () => {
//   const context = useContext(StockContext);
//   if (!context) {
//     throw new Error("useStockContext must be used within a StockProvider");
//   }
//   return context;
// };

// StockContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Stock {
  stockSymbol: string;
  marketPrice: number;
}

interface StockContextType {
  selectedStock: Stock | null;
  setSelectedStock: (stock: Stock) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  return (
    <StockContext.Provider value={{ selectedStock, setSelectedStock }}>
      {children}
    </StockContext.Provider>
  );
};

// ✅ Safe custom hook with debugging
export const useStockContext = () => {
  const context = useContext(StockContext);
  console.log("StockContext value:", context); // Debugging log
  if (!context) {
    throw new Error("useStockContext must be used inside StockProvider");
  }
  return context;
};
