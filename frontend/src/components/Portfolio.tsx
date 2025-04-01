


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
//         const response = await fetch(`http://localhost:5000/api/portfolio/${userId}`);
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


import React from "react";

interface Stock {
  stockSymbol: string;
  marketPrice: number;
  totalAmount: number;
  quantity: number;
  time: string;
  type: "buy" | "sell";
}

interface PortfolioProps {
  portfolio?: { balance: number; stocks: Stock[] };
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio, userId }) => {
  const stocks = portfolio?.stocks || []; // ✅ Ensure stocks is always an array
  console.log("📊 Portfolio prop received in UI:", portfolio); // ✅ Debugging
  console.log("🆔 UserId in Portfolio component:", userId); // ✅ Debugging userId
  return (
    <div className="portfolio-container">
      <h2>Portfolio</h2>
      <div className="balance">
        <strong>Current Balance:</strong> ${portfolio?.balance?.toFixed(2) || "0.00"}
      </div>
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Quantity</th>
            <th>Avg. Price</th>
          </tr>
        </thead>
        <tbody>
          {stocks.length > 0 ? (
            stocks.map((stock, index) => (
              <tr key={index}>
                <td>{stock.stockSymbol}</td>
                <td>{stock.quantity}</td>
                <td>  {stock.averagePrice.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No stocks in portfolio</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;



