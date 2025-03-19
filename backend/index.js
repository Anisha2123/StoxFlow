
const express = require("express");
const cors = require("cors");
const fetchYahooStockPrices = require("./api/stocks");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/stocks", async (req, res) => {
    try {
        const prices = await fetchYahooStockPrices();
        res.json(prices);
      } catch (error) {
        console.error("Error fetching stock prices:", error);
        res.status(500).json({ error: "Failed to fetch stock prices" });
      }
    });
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


