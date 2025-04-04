export interface Trade {
  _id: string;
  stockSymbol: string;
  marketPrice: number;
  totalAmount: number;
  quantity: number;
  tradeType: "buy" | "sell";
  timestamp: string;
} 