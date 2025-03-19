
// import axios from "axios";

// import { useState, useEffect } from "react";
// import { getIndianStockData } from "../services/stockServices";

// const StockPrice = ({ symbol }: { symbol: string }) => {
//   const [stockData, setStockData] = useState<any>(null);

//   useEffect(() => {
//     const fetchStockData = async () => {
//       const data = await getIndianStockData(symbol);
//       setStockData(data);
//     };

//     fetchStockData();
//     const interval = setInterval(fetchStockData, 60000); // Refresh every 1 minute
//     return () => clearInterval(interval);
//   }, [symbol]);

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md w-80">
//       <h2 className="text-xl font-semibold">{symbol} Stock Price</h2>
//       {stockData ? (
//         <div>
//           <p className="text-green-600">Latest Price: ₹{stockData.lastPrice}</p>
//           <p>Change: {stockData.change} ({stockData.pChange}%)</p>
//           <p>Open: ₹{stockData.open}</p>
//           <p>Day High: ₹{stockData.dayHigh}</p>
//           <p>Day Low: ₹{stockData.dayLow}</p>
//           <p>Previous Close: ₹{stockData.previousClose}</p>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default StockPrice;

