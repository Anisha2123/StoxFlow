

const express = require("express");
const router = express.Router();
const { getStockData } = require("../services/yahooFinanceService");

// GET stock data from Yahoo Finance
router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await getStockData(symbol.toUpperCase());
    res.json(stockData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

