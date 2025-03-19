

const express = require("express");
const axios = require("axios");
const yahooFinance = require("yahoo-finance2").default;

// const router = express.Router();


 
// List of 50 Indian Stocks (You can modify this list)
// const STOCK_SYMBOLS = [
//   "TCS.NS", "INFY.NS", "RELIANCE.NS", "SBIN.NS", "HDFCBANK.NS",
//   "ICICIBANK.NS", "AXISBANK.NS", "KOTAKBANK.NS", "LT.NS", "ITC.NS",
//   "HINDUNILVR.NS", "BAJFINANCE.NS", "ASIANPAINT.NS", "SUNPHARMA.NS", "TITAN.NS",
//   "ULTRACEMCO.NS", "WIPRO.NS", "TECHM.NS", "HCLTECH.NS", "ADANIENT.NS",
//   "ADANIGREEN.NS", "BHARTIARTL.NS", "COALINDIA.NS", "ONGC.NS", "POWERGRID.NS",
//   "NTPC.NS", "INDUSINDBK.NS", "MARUTI.NS", "EICHERMOT.NS", "M&M.NS",
//   "TATAMOTORS.NS", "HEROMOTOCO.NS", "BAJAJ-AUTO.NS", "DRREDDY.NS", "CIPLA.NS",
//   "DIVISLAB.NS", "NESTLEIND.NS", "BRITANNIA.NS", "HDFCLIFE.NS", "SBILIFE.NS",
//   "ICICIPRULI.NS", "UPL.NS", "GRASIM.NS", "JSWSTEEL.NS", "TATASTEEL.NS",
//   "HINDALCO.NS", "VEDL.NS", "SHREECEM.NS", "GAIL.NS", "DABUR.NS"
// ];
const STOCK_SYMBOLS = [
  "TCS.NS", "INFY.NS", "RELIANCE.NS", "SBIN.NS", "HDFCBANK.NS",
  "ICICIBANK.NS", "AXISBANK.NS", "KOTAKBANK.NS", "LT.NS", "ITC.NS",
  "HINDUNILVR.NS", "BAJFINANCE.NS", "ASIANPAINT.NS", "SUNPHARMA.NS", "TITAN.NS",
  "ULTRACEMCO.NS", "WIPRO.NS", "TECHM.NS", "HCLTECH.NS", "ADANIENT.NS",
  "ADANIGREEN.NS", "BHARTIARTL.NS", "COALINDIA.NS", "ONGC.NS", "POWERGRID.NS",
  "NTPC.NS", "INDUSINDBK.NS"
];
// Add Indices & Commodities
const INDICES = [
  "^NSEI",   // Nifty 50
  "^BSESN",  // Sensex
  "^NSEBANK", // Nifty Bank
  "^CNXIT",  // Nifty IT
  "^CNXFMCG", // Nifty FMCG
  "^CNXPHARMA", // Nifty Pharma
  "^CNXAUTO" // Nifty Auto
];

const COMMODITIES = [
  "GC=F", // Gold Futures
  "SI=F", // Silver Futures
  "CL=F", // Crude Oil
  "NG=F", // Natural Gas
];

// Combine all symbols
const ALL_SYMBOLS = [...STOCK_SYMBOLS, ...INDICES, ...COMMODITIES];

// Fetch Yahoo Finance Prices in Batches
const fetchYahooStockPrices = async () => {
  try {
    const options = { validateResult: false, headers: { "User-Agent": "Mozilla/5.0" } };

    const fetchInBatches = async (symbols) => {
      const batchSize = 10;
      let allResults = [];
      for (let i = 0; i < symbols.length; i += batchSize) {
        const batch = symbols.slice(i, i + batchSize);
        try {
          const batchResults = await yahooFinance.quote(batch, options);
          allResults = allResults.concat(batchResults);
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Prevent blocking
        } catch (error) {
          console.error("Batch fetch error:", error.message);
        }
      }
      return allResults;
    };

    const results = await fetchInBatches(ALL_SYMBOLS);

    return ALL_SYMBOLS.map((symbol) => {
      const stockData = results.find((item) => item.symbol === symbol);
      return {
        symbol,
        price: stockData?.regularMarketPrice ? `₹${stockData.regularMarketPrice}` : "N/A"
      };
    });
  } catch (error) {
    console.error("Yahoo Finance API Error:", error);
    return ALL_SYMBOLS.map((symbol) => ({ symbol, price: "N/A" }));
  }
};


module.exports = fetchYahooStockPrices;