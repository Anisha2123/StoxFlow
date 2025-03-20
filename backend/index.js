
const express = require("express");
const cors = require("cors");
const fetchYahooStockPrices = require("./api/stocks");
const yahooFinance = require("yahoo-finance2").default;
const axios =require("axios");
const stockRoutes = require("./routes/stockRoutes");
const aiRoutes = require("./routes/aiRoutes");
const sentimentRoutes = require("./routes/sentimentRoutes");



const app = express();
app.use(cors());
app.use(express.json());

// for stocks ratings 
app.use("/api/stocks", stockRoutes); // ✅ Mounts the stock routes

app.use("/api/ai", aiRoutes);

app.use("/api/sentiment", sentimentRoutes);

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


  

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


