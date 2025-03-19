

import { useEffect, useState } from "react";
import "../App.css";

interface Stock {
  symbol: string;
  price: string;
  previousPrice?: string;
}

const Dashboard = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [indices, setIndices] = useState<Stock[]>([]);
  const [commodities, setCommodities] = useState<Stock[]>([]);

  const fetchStockPrices = async () => {
    try {
      const response = await fetch("http://localhost:5000/stocks");
      const data: Stock[] = await response.json();

      setStocks((prevStocks) =>
        data
          .filter((item) => item.symbol.includes(".NS"))
          .map((stock) => {
            const prevStock = prevStocks.find((s) => s.symbol === stock.symbol);
            return { ...stock, previousPrice: prevStock?.price || stock.price };
          })
      );

      setIndices((prevIndices) =>
        data
          .filter((item) => item.symbol.startsWith("^"))
          .map((index) => {
            const prevIndex = prevIndices.find((s) => s.symbol === index.symbol);
            return { ...index, previousPrice: prevIndex?.price || index.price };
          })
      );

      setCommodities((prevCommodities) =>
        data
          .filter((item) => item.symbol.includes("="))
          .map((commodity) => {
            const prevCommodity = prevCommodities.find((s) => s.symbol === commodity.symbol);
            return { ...commodity, previousPrice: prevCommodity?.price || commodity.price };
          })
      );
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    fetchStockPrices(); // Fetch immediately
    const interval = setInterval(fetchStockPrices, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup
  }, []);

  // Function to determine color and trend icon
  const getPriceStyle = (currentPrice: string, previousPrice?: string) => {
    if (!previousPrice) return { color: "black", icon: "➖" };

    const curr = parseFloat(currentPrice.replace("₹", ""));
    const prev = parseFloat(previousPrice.replace("₹", ""));

    if (curr > prev) return { color: "green", icon: "🔼" };
    if (curr < prev) return { color: "red", icon: "🔻" };
    return { color: "black", icon: "➖" };
  };

  return (
    <div className="dashboard-container">
      <h1>📈 Indian Market Dashboard</h1>

      <h2>Stocks</h2>
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(({ symbol, price, previousPrice }) => {
            const { color, icon } = getPriceStyle(price, previousPrice);
            return (
              <tr key={symbol}>
                <td>{symbol.replace(".NS", "")}</td>
                <td style={{ color }}>
                  {price} {icon}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Market Indices</h2>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {indices.map(({ symbol, price, previousPrice }) => {
            const { color, icon } = getPriceStyle(price, previousPrice);
            return (
              <tr key={symbol}>
                <td>{symbol}</td>
                <td style={{ color }}>
                  {price} {icon}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Commodities</h2>
      <table>
        <thead>
          <tr>
            <th>Commodity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {commodities.map(({ symbol, price, previousPrice }) => {
            const { color, icon } = getPriceStyle(price, previousPrice);
            return (
              <tr key={symbol}>
                <td>{symbol}</td>
                <td style={{ color }}>
                  {price} {icon}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;




