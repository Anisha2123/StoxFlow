

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

// router.post("/save-trade", async (req, res) => {
//   try {
//     const { stockSymbol, marketPrice, totalAmount, quantity, tradeType } = req.body;
//     const newTrade = new Trade({ stockSymbol, marketPrice, totalAmount, quantity, tradeType });
    
//     await newTrade.save();
//     res.status(201).json({ message: "Trade saved successfully", trade: newTrade });
//   } catch (error) {
//     console.error("Error saving trade:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/save-trade/:userId", async (req, res) => {
  const { userId, stockSymbol, marketPrice, totalAmount, quantity, tradeType } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const newTrade = new Trade({
      userId,  // Associate trade with user
      stockSymbol,
      marketPrice,
      totalAmount,
      quantity,
      tradeType,
      timestamp: new Date(),
    });

    await newTrade.save();
    res.json({ message: "Trade saved", trade: newTrade });
  } catch (error) {
    res.status(500).json({ error: "Error saving trade" });
  }
});


// ✅ Fetch all trade history 
// router.get("/get-trades", async (req, res) => {
//   try {
//     const trades = await Trade.find().sort({ time: -1 }); // Sort by latest trade
//     res.status(200).json(trades);
//   } catch (error) {
//     console.error("Error fetching trades:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.get("/get-trades/:userId", async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: "Error fetching trades" });
  }
});


module.exports = router;

