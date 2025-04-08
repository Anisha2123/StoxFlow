

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./NavBar";
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
interface StockChartProps {
  symbol: string;
}

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
interface NewsItem {
  link: string;
  title: string;
  publisher: string;
  thumbnail?: {
    resolutions: { url: string }[];
  };
}
interface CandleData {
  o: number;
  h: number;
  l: number;
  c: number;
}

// return `O: ${(d as CandleData).o} H: ${(d as CandleData).h} L: ${(d as CandleData).l} C: ${(d as CandleData).c}`;
// return `O: ${(d as any).o} H: ${(d as any).h} L: ${(d as any).l} C: ${(d as any).c}`;



// const StockChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  // const StockChart: React.FC<{ hideNavbar?: boolean }> = ({ hideNavbar = false }) => {
    const StockChart: React.FC<{ hideNavbar?: boolean; hideNews?: boolean }> = ({ hideNavbar = false, hideNews = false }) => {

  const [symbol, setSymbol] = useState("AAPL"); // Default stock
  const [inputSymbol, setInputSymbol] = useState(""); // Input field value
  const [searchQuery, setSearchQuery] = useState("");
  const [chartType, setChartType] = useState("candlestick");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [aiRating, setAiRating] = useState<{
    symbol: string;
    rating: string;
    peRatio: number;
    roe: number;
    debtToEquity: number;
    currentPrice: number;
  } | null>(null);
  

  // const chartRef = useRef<ChartJS<keyof ChartTypeRegistry> | null>(null);
  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const [suggestions, setSuggestions] = useState<{ symbol: string; name: string }[]>([]);
  // const [sentiment, setSentiment] = useState({ sentimentScore: 0, sentimentLabel: "", news: [] });
  const [sentiment, setSentiment] = useState<{
    sentimentScore: number;
    sentimentLabel: string;
    news: NewsItem[];
  }>({
    sentimentScore: 0,
    sentimentLabel: "",
    news: [],
  });
  
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

        setStockData(data);
        setChartData(formatChartData(data, chartType));
      })
      .catch((error) => console.error("Error fetching stock data:", error));
  }, [symbol, chartType]);

  useEffect(() => {
    if (!stockData.length) return;

    // console.log(
    //   "Candlestick Data:",
    //   stockData.map((item) => ({
    //     x: new Date(item.date),
    //     o: item.open,
    //     h: item.high,
    //     l: item.low,
    //     c: item.close,
    //   }))
    // );

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, [chartType]);

  useEffect(() => {
    if (!symbol) return;
  
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/ratings/${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        setAiRating(data);
      })
      .catch((error) => console.error("Error fetching AI rating:", error));
  }, [symbol]);
  

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
    <div className="stockchart">
        {!hideNavbar && <Navbar />}
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
            {suggestions.map((stock) => (
              <li key={stock.symbol} onClick={() => {
                setSymbol(stock.symbol);
                setSearchQuery("");
                setSuggestions([]);
              }}>
                {stock.symbol} - {stock.name}
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
              return `O: ${(d as CandleData).o} H: ${(d as CandleData).h} L: ${(d as CandleData).l} C: ${(d as CandleData).c}`;
// return `O: ${(d as any).o} H: ${(d as any).h} L: ${(d as any).l} C: ${(d as any).c}`;
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
  <div className={`sentiment-card ${sentiment.sentimentLabel.toLowerCase()}`}>
    <h3>📊 Sentiment Analysis</h3>
    <p className="sentiment-score">
      Sentiment Score: <strong>{sentiment.sentimentScore.toFixed(2)}</strong>
    </p>
    <span className="sentiment-label">
      {sentiment.sentimentLabel === "Positive" ? "📈 Bullish" : 
       sentiment.sentimentLabel === "Negative" ? "📉 Bearish" : "⚖ Neutral"}
    </span>
    
  </div>
  {aiRating && (
  <div className="ai-rating-card">
    <h3>🤖 AI Stock Insight — {aiRating.symbol}</h3>
    <div className="ai-grid">
      <div><strong>📈 Rating:</strong> {aiRating.rating}</div>
      <div><strong>💵 Current Price:</strong> ${aiRating.currentPrice.toFixed(2)}</div>
      <div><strong>📊 P/E Ratio:</strong> {aiRating.peRatio}</div>
      <div><strong>📘 ROE:</strong> {(aiRating.roe * 100).toFixed(2)}%</div>
      <div><strong>📉 Debt/Equity:</strong> {aiRating.debtToEquity.toFixed(2)}</div>
    </div>
  </div>
)}



  {/* <div className="news-section">
    <h3>📰 Latest Market News</h3>
    <ul className="news-list">
      {sentiment.news.slice(0, 4).map((news, index) => (
        <li key={index} className="news-item">
          <a href={news.link} target="_blank" rel="noopener noreferrer">
            {news.thumbnail?.resolutions ? (
              <img src={news.thumbnail.resolutions[0].url} alt="News" className="news-image" />
            ) : (
              <div className="news-placeholder">No Image</div>
            )}
            <div className="news-text">
              <h4>{news.title}</h4>
              <p className="news-source">{news.publisher}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  </div> */}
  {!hideNews && (
  <div className="news-section">
    <h3>📰 Latest Market News</h3>
    <ul className="news-list">
      {sentiment.news.slice(0, 4).map((news, index) => (
        <li key={index} className="news-item">
          <a href={news.link} target="_blank" rel="noopener noreferrer">
            {news.thumbnail?.resolutions ? (
              <img src={news.thumbnail.resolutions[0].url} alt="News" className="news-image" />
            ) : (
              <div className="news-placeholder">No Image</div>
            )}
            <div className="news-text">
              <h4>{news.title}</h4>
              <p className="news-source">{news.publisher}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  </div>
)}

</div>




    </div>
    </div>

    
  );
};

export default StockChart;
