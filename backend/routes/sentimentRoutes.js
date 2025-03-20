

const express = require("express");
const router = express.Router();
const { analyzeSentiment } = require("../services/sentimentAnalysisService");

// Sentiment Analysis API
router.get("/:symbol", async (req, res) => {  // ✅ This is correct (not "/sentiment/:symbol")
  try {
    const { symbol } = req.params;
    const sentimentData = await analyzeSentiment(symbol.toUpperCase());
    res.json(sentimentData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
