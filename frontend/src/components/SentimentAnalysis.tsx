


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

import { useState, useEffect } from "react";

interface StockInfoProps {
  symbol: string;
}

interface AIRating {
  rating: string;
  [key: string]: any; // if there are other fields
}

interface Sentiment {
  sentimentLabel: string;
  sentimentScore: number;
  news: any[]; // you can replace `any[]` with your `NewsItem[]` type if needed
}

const StockInfo: React.FC<StockInfoProps> = ({ symbol }) => {
  const [aiRating, setAiRating] = useState<AIRating | null>(null);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);

  useEffect(() => {
    if (!symbol) return;

    // Fetch AI Stock Ratings
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/ratings/${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("AI Rating Data:", data);
        setAiRating(data);
      });

    // Fetch Sentiment Analysis
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sentiment/${symbol}`)
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
