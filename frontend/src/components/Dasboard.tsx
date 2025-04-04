

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Portfolio from "./Portfolio";
import "../App.css";

interface Stock {
  symbol: string;
  price: string;
  previousPrice?: string;
}
interface Portfolio {
  userId: string;
  stocks: Stock[];
  _id?: string;  // Optional if you don’t use it
}

const Dashboard = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [indices, setIndices] = useState<Stock[]>([]);
  const [commodities, setCommodities] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStockPrices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stocks`);
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

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPriceStyle = (currentPrice: string, previousPrice?: string) => {
    if (!previousPrice) return { color: "white", icon: "➖" };

    const curr = parseFloat(currentPrice.replace("₹", ""));
    const prev = parseFloat(previousPrice.replace("₹", ""));

    if (curr > prev) return { color: "#00c853", icon: "🔼" }; // Green
    if (curr < prev) return { color: "#d50000", icon: "🔻" }; // Red
    return { color: "white", icon: "➖" }; // No change
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📈 Indian Market Dashboard</h1>
          {/* Legend Bar */}
          <div className="legend-bar">
        <span><b>🔼</b> Price Increased (Green)</span>
        <span><b>🔻</b> Price Decreased (Red)</span>
        <span><b>➖</b> Price Unchanged (Black)</span>
      </div>

      {loading ? (
        <div className="loading-container">
          <ClipLoader color="#00c853" size={50} />
          <p>Fetching latest data...</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          <StockTable title="Stocks" data={stocks} getPriceStyle={getPriceStyle} />
          <div className="box">
          <StockTable title="Market Indices" data={indices} getPriceStyle={getPriceStyle} />
          <StockTable title="Commodities" data={commodities} getPriceStyle={getPriceStyle} />
            </div>
          
        </div>
      )}
     {/* <Portfolio portfolio={portfolio} userId={userId} /> */}
    </div>
  );
};

const StockTable = ({
  title,
  data,
  getPriceStyle,
}: {
  title: string;
  data: Stock[];
  getPriceStyle: (currentPrice: string, previousPrice?: string) => { color: string; icon: string };
}) => (
  <div className="table-container">
    <h2>{title}</h2>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>{title === "Stocks" ? "Stock" : "Name"}</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ symbol, price, previousPrice }) => {
            const { color, icon } = getPriceStyle(price, previousPrice);
            return (
              <tr key={symbol}>
                <td>{symbol.replace(/(\.NS|=)/g, "")}</td>
                <td style={{ color, fontWeight: "bold" }}>
                  {price} {icon}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default Dashboard;






