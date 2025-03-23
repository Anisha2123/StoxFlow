

const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");

// Get User Portfolio
router.get("/:userId", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    res.json(portfolio || { userId: req.params.userId, stocks: [] });
  } catch (error) {
    res.status(500).json({ error: "Error fetching portfolio" });
  }
});

// Update Portfolio on Trade Execution
// router.post("/update", async (req, res) => {
//   const { userId, stockSymbol, quantity, marketPrice, tradeType } = req.body;

//   try {
//     let portfolio = await Portfolio.findOne({ userId });

//     if (!portfolio) {
//       portfolio = new Portfolio({ userId, stocks: [] });
//     }

//     let stockIndex = portfolio.stocks.findIndex((s) => s.stockSymbol === stockSymbol);

//     if (tradeType === "buy") {
//       if (stockIndex >= 0) {
//         // Update existing stock
//         let stock = portfolio.stocks[stockIndex];
//         let totalCost = stock.quantity * stock.averagePrice + quantity * marketPrice;
//         stock.quantity += quantity;
//         stock.averagePrice = totalCost / stock.quantity;
//       } else {
//         // Add new stock
//         portfolio.stocks.push({ stockSymbol, quantity, averagePrice: marketPrice });
//       }
//     } else if (tradeType === "sell" && stockIndex >= 0) {
//       let stock = portfolio.stocks[stockIndex];
//       if (stock.quantity >= quantity) {
//         stock.quantity -= quantity;
//         if (stock.quantity === 0) {
//           portfolio.stocks.splice(stockIndex, 1);
//         }
//       } else {
//         return res.status(400).json({ error: "Not enough shares to sell" });
//       }
//     }

//     await portfolio.save();
//     res.json({ message: "Portfolio updated", portfolio });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating portfolio" });
//   }
// });

router.post("/update-portfolio/:userId", async (req, res) => {
  console.log("✅ API Called");
  console.log("🔹 Request Params:", req.params);
  console.log("🔹 Request Body:", req.body);
    const { stockSymbol, quantity, marketPrice, tradeType } = req.body;
    const userId = req.params.userId; // ✅ Fix: Get userId from req.params
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
  
    try {
      let portfolio = await Portfolio.findOne({ userId });
  
      if (!portfolio) {
        portfolio = new Portfolio({ userId, stocks: [] });
      }
  
      let stockIndex = portfolio.stocks.findIndex((s) => s.stockSymbol === stockSymbol);
  
      if (tradeType === "buy") {
        if (stockIndex >= 0) {
          let stock = portfolio.stocks[stockIndex];
          let totalCost = stock.quantity * stock.averagePrice + quantity * marketPrice;
          stock.quantity += quantity;
          stock.averagePrice = totalCost / stock.quantity;
        } else {
          portfolio.stocks.push({ stockSymbol, quantity, averagePrice: marketPrice });
        }
      } else if (tradeType === "sell" && stockIndex >= 0) {
        let stock = portfolio.stocks[stockIndex];
        if (stock.quantity >= quantity) {
          stock.quantity -= quantity;
          if (stock.quantity === 0) {
            portfolio.stocks.splice(stockIndex, 1);
          }
        } else {
          return res.status(400).json({ error: "Not enough shares to sell" });
        }
      }
  
      await portfolio.save();
      res.json({ message: "Portfolio updated", portfolio });
    } catch (error) {
      res.status(500).json({ error: "Error updating portfolio" });
    }
  });
  

module.exports = router;
