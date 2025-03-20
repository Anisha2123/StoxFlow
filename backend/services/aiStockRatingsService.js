

const yahooFinance = require("yahoo-finance2").default;

async function getStockRatings(symbol) {
  try {
    const data = await yahooFinance.quoteSummary(symbol, {
      modules: ["financialData", "defaultKeyStatistics", "price"],
    });

    const { financialData, defaultKeyStatistics, price } = data;

    // Fundamental Analysis
    const peRatio = financialData.trailingPE || 0;
    const roe = financialData.returnOnEquity || 0;
    const debtToEquity = financialData.totalDebt / financialData.totalRevenue || 0;

    // Technical Analysis
    const movingAvg50 = price.fiftyDayAverage;
    const movingAvg200 = price.twoHundredDayAverage;
    const currentPrice = price.regularMarketPrice;
    const isUptrend = currentPrice > movingAvg50 && movingAvg50 > movingAvg200;

    // AI-Based Rating Calculation
    let score = 0;
    if (peRatio < 20) score += 1;
    if (roe > 0.15) score += 1;
    if (debtToEquity < 0.5) score += 1;
    if (isUptrend) score += 1;

    const rating =
      score === 4 ? "Strong Buy" :
      score === 3 ? "Buy" :
      score === 2 ? "Hold" :
      "Sell";

    return { symbol, rating, peRatio, roe, debtToEquity, movingAvg50, movingAvg200, currentPrice };
  } catch (error) {
    console.error("Error fetching stock ratings:", error.message);
    throw new Error("Failed to analyze stock rating");
  }
}

module.exports = { getStockRatings };
