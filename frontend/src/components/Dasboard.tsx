

import { useEffect, useState } from "react";
import "../App.css";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [indices, setIndices] = useState([]);
  const [commodities, setCommodities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/stocks")
      .then((res) => res.json())
      .then((data) => {
        setStocks(data.filter((item) => item.symbol.includes(".NS")));
        setIndices(data.filter((item) => item.symbol.startsWith("^")));
        setCommodities(data.filter((item) => item.symbol.includes("=")));
      })
      .catch((err) => console.error("Error fetching stock data:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <h1>📈 Indian Market Dashboard</h1>

      <h2>Stocks</h2>
      <table>
        <thead>
          <tr><th>Stock</th><th>Price</th></tr>
        </thead>
        <tbody>
          {stocks.map(({ symbol, price }) => (
            <tr key={symbol}><td>{symbol.replace(".NS", "")}</td><td>{price}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Market Indices</h2>
      <table>
        <thead>
          <tr><th>Index</th><th>Price</th></tr>
        </thead>
        <tbody>
          {indices.map(({ symbol, price }) => (
            <tr key={symbol}><td>{symbol}</td><td>{price}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Commodities</h2>
      <table>
        <thead>
          <tr><th>Commodity</th><th>Price</th></tr>
        </thead>
        <tbody>
          {commodities.map(({ symbol, price }) => (
            <tr key={symbol}><td>{symbol}</td><td>{price}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;



