

const express = require("express");
const axios = require("axios");
const yahooFinance = require("yahoo-finance2").default;

const router = express.Router();
const ALPHA_VANTAGE_KEY = "ZI67PRFNX55WSWFP"; // Replace with actual API key



// List of 50 Indian Stocks (You can modify this list)
const STOCK_SYMBOLS = [
  "TCS.NS", "INFY.NS", "RELIANCE.NS", "SBIN.NS", "HDFC.NS",
  "ICICIBANK.NS", "AXISBANK.NS", "KOTAKBANK.NS", "LT.NS", "ITC.NS",
  "HINDUNILVR.NS", "BAJFINANCE.NS", "ASIANPAINT.NS", "SUNPHARMA.NS", "TITAN.NS",
  "ULTRACEMCO.NS", "WIPRO.NS", "TECHM.NS", "HCLTECH.NS", "ADANIENT.NS",
  "ADANIGREEN.NS", "BHARTIARTL.NS", "COALINDIA.NS", "ONGC.NS", "POWERGRID.NS",
  "NTPC.NS", "INDUSINDBK.NS", "MARUTI.NS", "EICHERMOT.NS", "M&M.NS",
  "TATAMOTORS.NS", "HEROMOTOCO.NS", "BAJAJ-AUTO.NS", "DRREDDY.NS", "CIPLA.NS",
  "DIVISLAB.NS", "NESTLEIND.NS", "BRITANNIA.NS", "HDFCLIFE.NS", "SBILIFE.NS",
  "ICICIPRULI.NS", "UPL.NS", "GRASIM.NS", "JSWSTEEL.NS", "TATASTEEL.NS",
  "HINDALCO.NS", "VEDL.NS", "SHREECEM.NS", "GAIL.NS", "DABUR.NS"
];

// Add Indices & Commodities
const INDICES = [
  "^NSEI", // Nifty 50
  "^BSESN", // Sensex
  "^BANKNIFTY", // Bank Nifty
  "^CNXIT", // Nifty IT
];

const COMMODITIES = [
  "GC=F", // Gold Futures
  "SI=F", // Silver Futures
  "CL=F", // Crude Oil
  "NG=F", // Natural Gas
];

// Combine all symbols
const ALL_SYMBOLS = [...STOCK_SYMBOLS, ...INDICES, ...COMMODITIES];

const fetchYahooStockPrices = async () => {
  try {
    const stockData = await yahooFinance.quote(STOCK_SYMBOLS);

    return STOCK_SYMBOLS.map((symbol, index) => ({
      symbol,
      price: stockData[index]?.regularMarketPrice
        ? `₹${stockData[index].regularMarketPrice}`
        : "N/A"
    }));
  } catch (error) {
    console.error("Yahoo Finance API Error:", error.message);
    return STOCK_SYMBOLS.map((symbol) => ({ symbol, price: "N/A" }));
  }
};

module.exports = fetchYahooStockPrices;

// module.exports = router;
