
const express = require("express");
const cors = require("cors");
const fetchYahooStockPrices = require("./api/stocks");
const yahooFinance = require("yahoo-finance2").default;
const axios =require("axios");
const stockRoutes = require("./routes/stockRoutes");
const aiRoutes = require("./routes/aiRoutes");
const sentimentRoutes = require("./routes/sentimentRoutes");
const authRoutes = require("./routes/authRoutes");
const virtualTradingRoutes = require("./routes/virtualTradingRoutes");

const portfolioRoutes = require("./routes/portfolio"); // Import portfolio route

const dotenv = require("dotenv")
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/stockDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));


  // for authentication 
  app.use("/api/auth", authRoutes);

// for stocks ratings 
app.use("/api/stocks", stockRoutes); // ✅ Mounts the stock routes

// Virtual Trading API
app.use("/api/virtual-trading", virtualTradingRoutes);
app.use("/api/trades", virtualTradingRoutes);

app.use("/api/ai", aiRoutes);

// for sentiment analysis
app.use("/api/sentiment", sentimentRoutes);
// app.use("/api/ai/ratings", sentimentRoutes);


// Use portfolio routes 
app.use("/api/portfolio", portfolioRoutes); // ✅ Prefix the route


// for dashboard live prices
app.get("/stocks", async (req, res) => {
    try {
        const prices = await fetchYahooStockPrices();
        res.json(prices);
      } catch (error) {
        console.error("Error fetching stock prices:", error);
        res.status(500).json({ error: "Failed to fetch stock prices" });
      }
    });
//  for charts 
// app.get("/stock-data", async (req, res) => {
//     const { symbol } = req.query;
//     if (!symbol || symbol === "undefined") {
//       return res.status(400).json({ error: "Stock symbol is missing or invalid" });
//     }

//     try {
//       const stockData = await yahooFinance.historical(symbol, { period1: "2024-01-01", interval: "1d" });

//       if (!Array.isArray(stockData) || stockData.length === 0) {
//         throw new Error("No data found");
//       }

//       console.log("Raw API Response:", stockData); // ✅ Debug raw data

//       res.json(stockData.map(item => ({
//         date: new Date(item.date), // ✅ Send as Date object
//         open: item.open,
//         high: item.high,
//         low: item.low,
//         close: item.close,
//         volume: item.volume,
//       })));
//     } catch (error) {
//       console.error("Yahoo Finance API error:", error);
//       res.status(500).json({ error: "Failed to fetch stock data" });
//     }
// });
app.get("/stock-data", async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Stock symbol is required" });

    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
    const response = await axios.get(yahooUrl);

    const chartData = response.data.chart.result[0];
    const timestamps = chartData.timestamp;
    const prices = chartData.indicators.quote[0];

    const formattedData = timestamps.map((time, index) => ({
      date: new Date(time * 1000).toISOString(),
      open: prices.open[index],
      high: prices.high[index],
      low: prices.low[index],
      close: prices.close[index],
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});
// for searching stocks in search bar 

  // Fetch stock suggestions from Yahoo Finance

app.get("/search-stocks", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    const yahooUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${query}`;
    const response = await axios.get(yahooUrl);

    const suggestions = response.data.quotes.map((stock) => ({
      symbol: stock.symbol,
      name: stock.shortname || stock.longname,
      exchange: stock.exchange,
    }));

    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching stock suggestions:", error);
    res.status(500).json({ error: "Failed to fetch stock suggestions" });
  }
});


app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


