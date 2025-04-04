


// import React, { useEffect, useState } from "react";

// interface Stock {
//   stockSymbol: string;
//   quantity: number;
//   averagePrice: number;
// }

// const Portfolio: React.FC<{ userId: string }> = ({ userId }) => {
//   const [portfolio, setPortfolio] = useState<Stock[]>([]);

//   useEffect(() => {
//     const fetchPortfolio = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/portfolio/${userId}`);
//         const data = await response.json();
//         setPortfolio(data.stocks || []);
//       } catch (error) {
//         console.error("Error fetching portfolio:", error);
//       }
//     };

//     fetchPortfolio();
//   }, [userId]);

//   return (
//     <div className="portfolio-container">
//       <h2>📈 Portfolio</h2>
//       {portfolio.length === 0 ? (
//         <p>No stocks in portfolio.</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Stock</th>
//               <th>Quantity</th>
//               <th>Avg. Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {portfolio.map((stock) => (
//               <tr key={stock.stockSymbol}>
//                 <td>{stock.stockSymbol}</td>
//                 <td>{stock.quantity}</td>
//                 <td>${stock.averagePrice.toFixed(2)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Portfolio;


// import React from "react";

// interface Stock {
//   stockSymbol: string;
//   marketPrice: number;
//   totalAmount: number;
//   quantity: number;
//   time: string;
//   type: "buy" | "sell";
// }

// // interface Stock {
// //   stockSymbol: string;
// //   quantity: number;
// //   averagePrice: number;
// //   marketPrice?: number; 
// //   totalInvested: number;
// //   currentValue: number;
// //   totalReturns: number;
// //   returnPercentage: number;
// // }

// interface PortfolioProps {
//   portfolio?: { 
//     balance: number;
//     stocks: Stock[];
//     totalInvested: number;
//     currentTotalAmount: number;
//     totalReturns: number;
//     returnPercentage: number;
//   };
// }

// const Portfolio: React.FC<PortfolioProps> = ({ portfolio, userId }) => {
//   const stocks = portfolio?.stocks || []; // ✅ Ensure stocks is always an array
//   console.log("📊 Portfolio prop received in UI:", portfolio); // ✅ Debugging
//   console.log("🆔 UserId in Portfolio component:", userId); // ✅ Debugging userId
//   return (
//     <div className="portfolio-container">
//       <h2>Portfolio</h2>
//       <div className="balance">
//         <strong>Current Balance:</strong> ${portfolio?.balance?.toFixed(2) || "0.00"}
//       </div>
//       <div className="summary">
//         <p><strong>Total Invested:</strong> ${portfolio?.totalInvested?.toFixed(2) || "0.00"}</p>
//         <p><strong>Current Value:</strong> ${portfolio?.currentTotalAmount?.toFixed(2) || "0.00"}</p>
//         <p 
//           className={portfolio?.totalReturns >= 0 ? "profit" : "loss"}>
//           <strong>Total Returns:</strong> 
//           <span> ${portfolio?.totalReturns?.toFixed(2) || "0.00"} </span>
//           ({portfolio?.returnPercentage?.toFixed(2) || "0.00"}%)
//         </p>
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>Stock</th>
//             <th>Quantity</th>
//             <th>Avg. Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stocks.length > 0 ? (
//             stocks.map((stock, index) => (
//               <tr key={index}>
//                 <td>{stock.stockSymbol}</td>
//                 <td>{stock.quantity}</td>
//                 <td>  {stock.averagePrice.toFixed(2)}</td>
//                 <td>${stock.marketPrice?.toFixed(2) || "N/A"}</td>
//                 <td>${stock.totalInvested.toFixed(2)}</td>
//                 <td>${stock.currentValue.toFixed(2)}</td>
//                 <td className={stock.totalReturns >= 0 ? "profit" : "loss"}>
//                   ${stock.totalReturns.toFixed(2)} ({stock.returnPercentage.toFixed(2)}%)
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={3}>No stocks in portfolio</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Portfolio;

import React from "react";

interface Stock {
  stockSymbol: string;
  quantity: number;
  averagePrice: number;
  marketPrice: number;
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  returnPercentage: number;
}

interface PortfolioProps {
  portfolio?: { balance: number; stocks: Stock[] };
  userId: string;
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio,  userId }) => {
  const stocks = portfolio?.stocks || [];

  return (
    <div className="portfolio-container">
      <h2>Portfolio</h2>

      <div className="summary">
        <p><strong>💰 Current Balance:</strong> ${portfolio?.balance?.toFixed(2) || "0.00"}</p>
        <p><strong>📈 Total Invested:</strong> ${stocks.reduce((acc, stock) => acc + (stock.totalInvested || 0), 0).toFixed(2)}</p>
        <p><strong>📊 Current Value:</strong> ${stocks.reduce((acc, stock) => acc + (stock.currentValue || 0), 0).toFixed(2)}</p>
        <p 
          className={stocks.reduce((acc, stock) => acc + (stock.totalReturns || 0), 0) >= 0 ? "profit" : "loss"}>
          <strong>🔄 Total Returns:</strong> 
          <span> ${stocks.reduce((acc, stock) => acc + (stock.totalReturns || 0), 0).toFixed(2)} </span>
          ({stocks.reduce((acc, stock) => acc + (stock.returnPercentage || 0), 0).toFixed(2)}%)
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Quantity</th>
            <th>Avg. Price</th>
            <th>Market Price</th>
            <th>Total Invested</th>
            <th>Current Value</th>
            <th>Total Returns</th>
          </tr>
        </thead>
        <tbody>
          {stocks.length > 0 ? (
            stocks.map((stock, index) => (
              <tr key={index}>
                <td>{stock.stockSymbol}</td>
                <td>{stock.quantity}</td>
                <td>${(stock.averagePrice || 0).toFixed(2)}</td>
                <td>${(stock.marketPrice || 0).toFixed(2)}</td>
                <td>${(stock.totalInvested || 0).toFixed(2)}</td>
                <td>${(stock.currentValue || 0).toFixed(2)}</td>
                <td className={stock.totalReturns >= 0 ? "profit" : "loss"}>
                  ${((stock.totalReturns || 0).toFixed(2))} ({(stock.returnPercentage || 0).toFixed(2)}%)
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No stocks in portfolio</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;




