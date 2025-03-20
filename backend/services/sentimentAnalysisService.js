

const axios = require("axios");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");

// Function to fetch stock news from Yahoo Finance
async function fetchStockNews(symbol) {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}`);
    return response.data.news || [];
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return [];
  }
}

// Function to perform sentiment analysis
async function analyzeSentiment(symbol) {
  try {
    const news = await fetchStockNews(symbol);

    if (news.length === 0) return { sentimentScore: 0, sentimentLabel: "Neutral" };

    let totalScore = 0;
    news.forEach((article) => {
      const words = tokenizer.tokenize(article.title);
      const score = analyzer.getSentiment(words);
      totalScore += score;
    });

    const avgScore = totalScore / news.length;
    const sentimentLabel =
      avgScore > 0.5 ? "Bullish" :
      avgScore < -0.5 ? "Bearish" :
      "Neutral";

    return { sentimentScore: avgScore, sentimentLabel, news };
  } catch (error) {
    console.error("Error analyzing sentiment:", error.message);
    return { sentimentScore: 0, sentimentLabel: "Neutral" };
  }
}

module.exports = { analyzeSentiment };
