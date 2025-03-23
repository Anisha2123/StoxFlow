


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
  portfolio?: { balance: number; stocks: Stock[] }; // ✅ Make portfolio optional
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio = { balance: 0, stocks: [] } }) => {
  const stocks = portfolio?.stocks || []; // ✅ Ensure stocks is always an array

  return (
    <div className="portfolio-container">
      <h3>Portfolio</h3>
      <p>Balance: ${portfolio?.balance ? portfolio.balance.toFixed(2) : "0.00"}</p> {/* ✅ Prevents `toFixed` error */}
      <ul>
        {stocks.length > 0 ? (
          stocks.map((stock, index) => (
            <li key={index}>
              {stock.stockSymbol} - {stock.quantity} shares @ ${stock.marketPrice}
            </li>
          ))
        ) : (
          <p>No stocks available</p>
        )}
      </ul>
    </div>
  );
};

export default Portfolio;



