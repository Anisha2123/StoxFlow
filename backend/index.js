
const express = require("express");
const cors = require("cors");
const fetchYahooStockPrices = require("./api/stocks");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
app.use(cors());
app.use(express.json());

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
app.get("/stock-data", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol || symbol === "undefined") {
      return res.status(400).json({ error: "Stock symbol is missing or invalid" });
    }

    try {
      const stockData = await yahooFinance.historical(symbol, { period1: "2024-01-01", interval: "1d" });

      if (!Array.isArray(stockData) || stockData.length === 0) {
        throw new Error("No data found");
      }

      console.log("Raw API Response:", stockData); // ✅ Debug raw data

      res.json(stockData.map(item => ({
        date: new Date(item.date), // ✅ Send as Date object
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      })));
    } catch (error) {
      console.error("Yahoo Finance API error:", error);
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

  

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


