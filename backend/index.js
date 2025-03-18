
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const STOCK_API = "https://www.alphavantage.co/query";
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

app.get("/stock/:symbol", async (req, res) => {
    try {
        const { symbol } = req.params;
        const response = await axios.get(`${STOCK_API}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
