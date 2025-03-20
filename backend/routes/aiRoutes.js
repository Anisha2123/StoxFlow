

const express = require("express");
const router = express.Router();
const { getStockRatings } = require("../services/aiStockRatingsService");

// AI Stock Ratings API
router.get("/ratings/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const ratingData = await getStockRatings(symbol.toUpperCase());
    res.json(ratingData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
