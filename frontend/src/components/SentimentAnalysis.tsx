


import { useState, useEffect } from "react";

const StockInfo = ({ symbol }) => {
  const [aiRating, setAiRating] = useState(null);
  const [sentiment, setSentiment] = useState(null);

  useEffect(() => {
    if (!symbol) return;

      // Fetch AI Stock Ratings
  fetch(`http://localhost:5000/api/ai/ratings/${symbol}`)
  .then((res) => res.json())
  .then((data) => {
    console.log("AI Rating Data:", data);  // Log the data to the console
    setAiRating(data);
  });

    // Fetch Sentiment Analysis
    fetch(`http://localhost:5000/api/sentiment/${symbol}`)
      .then((res) => res.json())
      .then((data) => setSentiment(data));
  }, [symbol]);

  return (
    <div>
      <h3>AI Stock Rating: {aiRating?.rating || "Loading..."}</h3>
      <h3>Sentiment: {sentiment?.sentimentLabel || "Loading..."}</h3>
    </div>
  );
};

export default StockInfo;
