

const express = require("express");
const router = express.Router();
const Trade = require("../models/Trade.js");
const Portfolio = require("../models/Portfolio");
const { getStockData } = require("../services/yahooFinanceService");

// Fetch user's virtual portfolio
router.get("/portfolio/:userId", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Place a virtual trade
// router.post("/trade", async (req, res) => {
//   try {
//     const { userId, stockSymbol, tradeType, quantity } = req.body;
//     const stockData = await getStockData(stockSymbol.toUpperCase());
//     const price = stockData.currentPrice;
//     const total = price * quantity;

//     let portfolio = await Portfolio.findOne({ userId });
//     if (!portfolio) {
//       portfolio = new Portfolio({ userId, stocks: [], balance: 100000 });
//     }

//     if (tradeType === "buy") {
//       if (portfolio.balance < total) {
//         return res.status(400).json({ error: "Insufficient balance" });
//       }
//       portfolio.balance -= total;
//       const existingStock = portfolio.stocks.find(s => s.stockSymbol === stockSymbol);
//       if (existingStock) {
//         existingStock.quantity += quantity;
//         existingStock.averagePrice = (existingStock.averagePrice * existingStock.quantity + total) / (existingStock.quantity + quantity);
//       } else {
//         portfolio.stocks.push({ stockSymbol, stockName: stockData.name, quantity, averagePrice: price, totalValue: total });
//       }
//     } else if (tradeType === "sell") {
//       const existingStock = portfolio.stocks.find(s => s.stockSymbol === stockSymbol);
//       if (!existingStock || existingStock.quantity < quantity) {
//         return res.status(400).json({ error: "Not enough stocks to sell" });
//       }
//       portfolio.balance += total;
//       existingStock.quantity -= quantity;
//       existingStock.totalValue -= total;
//       if (existingStock.quantity === 0) {
//         portfolio.stocks = portfolio.stocks.filter(s => s.stockSymbol !== stockSymbol);
//       }
//     }

//     await portfolio.save();
//     const trade = new VirtualTrade({ userId, stockSymbol, stockName: stockData.name, tradeType, quantity, price, total });
//     await trade.save();
    
//     res.json({ message: "Trade successful", trade, portfolio });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/save-trade", async (req, res) => {
  try {
    const { stockSymbol, marketPrice, totalAmount, quantity, tradeType } = req.body;
    const newTrade = new Trade({ stockSymbol, marketPrice, totalAmount, quantity, tradeType });
    
    await newTrade.save();
    res.status(201).json({ message: "Trade saved successfully", trade: newTrade });
  } catch (error) {
    console.error("Error saving trade:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Fetch all trade history 
router.get("/get-trades", async (req, res) => {
  try {
    const trades = await Trade.find().sort({ time: -1 }); // Sort by latest trade
    res.status(200).json(trades);
  } catch (error) {
    console.error("Error fetching trades:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

