

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useStockContext } from "./StockContext"; // ✅ Check if context is imported

// const { setSelectedStock } = useStockContext(); // ✅ Safe inside component
import "../App.css";
import {
  Chart as ChartJS,
  ChartTypeRegistry,   
  CategoryScale,
  LinearScale,
  BarElement, 
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "chartjs-chart-financial";
import "chartjs-adapter-date-fns"; // ✅ REQUIRED for TimeScale to work properly
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import { Chart } from "react-chartjs-2";
import "../App.css";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale, // ✅ Correct scale
  BarElement,
  LineElement,
  PointElement,
  CandlestickController,
  CandlestickElement,
  Title,
  Tooltip,
  Legend
);

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// const StockChart: React.FC<{ symbol: string }> = ({ symbol }) => {
const StockChart: React.FC = () => {
  const [symbol, setSymbol] = useState("AAPL"); // Default stock
  const [inputSymbol, setInputSymbol] = useState(""); // Input field value
  const [searchQuery, setSearchQuery] = useState("");
  const [chartType, setChartType] = useState("candlestick");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const chartRef = useRef<ChartJS<keyof ChartTypeRegistry> | null>(null);
  const [suggestions, setSuggestions] = useState<{ symbol: string; name: string }[]>([]);
  const [sentiment, setSentiment] = useState({ sentimentScore: 0, sentimentLabel: "", news: [] });
  const { selectedStock, setSelectedStock } = useStockContext(); // ✅ Use context
  
// const { handleSelectStock } = useStockContext(); // ✅ Extract function from context

  useEffect(() => {
    if (!symbol) return;
  
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sentiment/${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        setSentiment(data);
      })
      .catch((error) => console.error("Error fetching sentiment:", error));
  }, [symbol]);

  useEffect(() => {
    if (searchQuery.length < 2) return setSuggestions([]);

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/search-stocks?query=${searchQuery}`)
      .then((res) => setSuggestions(res.data))
      .catch((err) => console.error("Search error:", err));
  }, [searchQuery]);


  useEffect(() => {
    if (!symbol) {
      console.error("Symbol is undefined!");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/stock-data?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        const latestStock = data[data.length - 1]; // ✅ Get latest stock price

        setSelectedStock({
          stockSymbol: symbol,
          marketPrice: latestStock.marketPrice, // ✅ Update context with selected stock
        });
  
      
     
         // ✅ Ensure `setSelectedStock` is available before using
         if (setSelectedStock) {
          setSelectedStock({
            stockSymbol: symbol,
            marketPrice: latestStock.close, // ✅ Use close price for market price
          });
        }

        console.log("Selected Stock:", symbol, "Market Price:", latestStock.marketPrice);

        setStockData(data);
        setChartData(formatChartData(data, chartType));
      })
      .catch((error) => console.error("Error fetching stock data:", error));
  }, [symbol, chartType]);

  useEffect(() => {
    if (!stockData.length) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, [chartType]);

   // ✅ Fix: Update context when selecting stock
   const handleSelectStock = (stockSymbol: string) => {
    console.log("📢 handleSelectStock called with:", stockSymbol);
    setSymbol(stockSymbol);

    // Fetch market price and update context
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/stock-data?symbol=${stockSymbol}`)
      .then((res) => {
        const latestStock = res.data[res.data.length - 1];
        setSelectedStock({ stockSymbol, marketPrice: latestStock.close });
      })
      .catch((error) => console.error("Error fetching stock price:", error));
  };

  // const handleSelectStock = (symbol: string) => {
  //   console.log("📢 handleSelectStock called with:", symbol);
  //   setSymbol(symbol);
  // };
  
  

  const formatChartData = (data: StockData[], type: string) => {
    if (type === "candlestick") {
      return {
        datasets: [
          {
            label: `${symbol} Candlestick`,
            data: data.map((item) => ({
              x: new Date(item.date).getTime(), // ✅ Ensure timestamps
              o: item.open,
              h: item.high,
              l: item.low,
              c: item.close,
            })),
            borderColor: "rgba(0, 200, 83, 1)", // ✅ Green border
            borderWidth: 1.5,
            backgroundColor: "rgba(0, 200, 83, 0.2)", // ✅ Semi-transparent green
          },
        ],
      };
    }
    return {
      labels: data.map((item) => new Date(item.date).toLocaleDateString()),
      datasets: [
        {
          label: `${symbol} Prices`,
          data: data.map((item) => item.close),
          backgroundColor: type === "bar" ? "#00c853" : "rgba(0, 200, 83, 0.5)",
          borderColor: "#00c853",
          borderWidth: 1.5,
        },
      ],
    };
  };
  
  
  return (
    <div className="chart-container">
        <div className="search-bar">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {/* {suggestions.map((stock) => (
              <li key={stock.symbol} onClick={() => {
                setSymbol(stock.symbol);
                setSearchQuery("");
                setSuggestions([]);
              }}>
                {stock.symbol} - {stock.name} */}
                {suggestions.map((stock) => (
          <li key={stock.symbol} onClick={() => handleSelectStock(stock.symbol)}>
            {stock.symbol}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2 className="chart-title">{symbol} Stock Chart</h2>
      <div className="chart-controls">
        <button
          className={chartType === "candlestick" ? "active" : ""}
          onClick={() => setChartType("candlestick")}
        >
          Candlestick
        </button>
        <button className={chartType === "line" ? "active" : ""} onClick={() => setChartType("line")}>
          Line
        </button>
        <button className={chartType === "bar" ? "active" : ""} onClick={() => setChartType("bar")}>
          Bar
        </button>
      </div>

      <div className="chart-content">
      {chartType === "candlestick" && chartData && (
  <Chart
    ref={chartRef}
    type="candlestick"
    data={chartData}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
          ticks: {
            color: "#ffffff",
          },
        },
        y: {
          ticks: {
            color: "#ffffff",
          },
        },
      },
      
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              let d = tooltipItem.raw;
              // return `O: ${d.o} H: ${d.h} L: ${d.l} C: ${d.c}`;
              return `O: ${(d as any).o} H: ${(d as any).h} L: ${(d as any).l} C: ${(d as any).c}`;

            },
          },
        },
      },
    }}
    style={{ height: "100%" }} // 🔥 Ensure it fills parent div
  />
)}


        {chartType === "line" && chartData && (
          <Line data={chartData} options={{ responsive: true }} />
        )}
        {chartType === "bar" && chartData && (
          <Bar data={chartData} options={{ responsive: true }} />
        )}
      </div>
      <div className="sentiment-container">
  


</div>




    </div>
    
  );
};

export default StockChart;


