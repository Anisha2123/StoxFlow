
const express = require("express");
const cors = require("cors");
const fetchYahooStockPrices = require("./api/stocks");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/stocks", async (req, res) => {
    const stocks = await fetchYahooStockPrices();
    res.json(stocks);
  });

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


