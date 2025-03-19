

// import { useState, useEffect } from "react";
// import { getStockData } from "../services/stockService";

// const StockPrice = ({ symbol }: { symbol: string }) => {
//   const [stockData, setStockData] = useState<any>(null);

//   useEffect(() => {
//     const fetchStockData = async () => {
//       const data = await getStockData(symbol);
//       setStockData(data);
//     };

//     fetchStockData();
//     const interval = setInterval(fetchStockData, 60000); // Refresh every minute
//     return () => clearInterval(interval);
//   }, [symbol]);

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md w-80">
//       <h2 className="text-xl font-semibold">{symbol} Stock Price</h2>
//       {stockData ? (
//         <div>
//           <p className="text-green-600">Latest Price: ${Object.values(stockData)[0]["4. close"]}</p>
//           <p>Time: {Object.keys(stockData)[0]}</p>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default StockPrice;

