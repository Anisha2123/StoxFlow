


// import { useState, useEffect } from "react";

// interface StockInfoProps {
//   symbol: string;
// }




// const StockInfo = ({ symbol }) => {
//   const [aiRating, setAiRating] = useState(null);
//   const [sentiment, setSentiment] = useState(null);

//   useEffect(() => {
//     if (!symbol) return;

//       // Fetch AI Stock Ratings
//   fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/ratings/${symbol}`)
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("AI Rating Data:", data);  // Log the data to the console
//     setAiRating(data);
//   });

//     // Fetch Sentiment Analysis
//     fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sentiment/${symbol}`)
//       .then((res) => res.json())
//       .then((data) => setSentiment(data));
//   }, [symbol]);

//   return (
//     <div>
//       <h3>AI Stock Rating: {aiRating?.rating || "Loading..."}</h3>
//       <h3>Sentiment: {sentiment?.sentimentLabel || "Loading..."}</h3>
//     </div>
//   );
// };

// export default StockInfo;

// import { useState, useEffect } from "react";

// interface StockInfoProps {
//   symbol: string;
// }

// interface AIRating {
//   rating: string;
//   [key: string]: any; // if there are other fields
// }

// interface Sentiment {
//   sentimentLabel: string;
//   sentimentScore: number;
//   news: any[]; // you can replace `any[]` with your `NewsItem[]` type if needed
// }

// const StockInfo: React.FC<StockInfoProps> = ({ symbol }) => {
//   const [aiRating, setAiRating] = useState<AIRating | null>(null);
//   const [sentiment, setSentiment] = useState<Sentiment | null>(null);

//   useEffect(() => {
//     if (!symbol) return;

//     // Fetch AI Stock Ratings
//     fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/ratings/${symbol}`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("AI Rating Data:", data);
//         setAiRating(data);
//       });

//     // Fetch Sentiment Analysis
//     fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sentiment/${symbol}`)
//       .then((res) => res.json())
//       .then((data) => setSentiment(data));
//   }, [symbol]);

//   return (
//     <div>
//       <h3>AI Stock Rating: {aiRating?.rating || "Loading..."}</h3>
//       <h3>Sentiment: {sentiment?.sentimentLabel || "Loading..."}</h3>
//     </div>
//   );
// };

// export default StockInfo;

import { useState, useEffect } from "react";

interface StockInfoProps {
  symbol: string;
}

interface AIRating {
  rating: string;
  peRatio: number;
  roe: number;
  debtToEquity: number;
  movingAvg50: number;
  movingAvg200: number;
  currentPrice: number;
}

interface Sentiment {
  sentimentLabel: string;
  sentimentScore: number;
  news: { title: string; url: string }[]; // Optional: adjust to match your backend
}

const StockInfo: React.FC<StockInfoProps> = ({ symbol }) => {
  const [aiRating, setAiRating] = useState<AIRating | null>(null);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);

  useEffect(() => {
    if (!symbol) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/ratings/${symbol}`)
      .then((res) => res.json())
      .then((data) => setAiRating(data))
      .catch((err) => console.error("Error fetching AI rating:", err));

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sentiment/${symbol}`)
      .then((res) => res.json())
      .then((data) => setSentiment(data))
      .catch((err) => console.error("Error fetching sentiment:", err));
  }, [symbol]);

  return (
    <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>📊 AI Stock Analysis for {symbol}</h2>
      

      {aiRating ? (
        <div style={{ marginBottom: "20px" , background:"black"}}>
          <h3>⭐ AI Rating: {aiRating.rating}</h3>
          <p>• PE Ratio: {aiRating.peRatio}</p>
          <p>• Return on Equity (ROE): {aiRating.roe}</p>
          <p>• Debt/Equity: {aiRating.debtToEquity}</p>
          <p>• Current Price: ${aiRating.currentPrice}</p>
          <p>• 50-Day MA: {aiRating.movingAvg50}</p>
          <p>• 200-Day MA: {aiRating.movingAvg200}</p>
        </div>
      ) : (
        <p>Loading AI Rating...</p>
      )}

      {sentiment ? (
        <div>
          <h3>💬 Sentiment: {sentiment.sentimentLabel}</h3>
          <p>• Score: {sentiment.sentimentScore}</p>
          {sentiment.news?.length > 0 && (
            <div>
              <h4>📰 Related News:</h4>
              <ul>
                {sentiment.news.slice(0, 3).map((item, idx) => (
                  <li key={idx}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Loading Sentiment...</p>
      )}
    </div>
  );
};

export default StockInfo;

