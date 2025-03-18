

import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

// Add stock to portfolio
router.post("/add", async (req, res) => {
    const { userId, symbol, quantity, price } = req.body;

    try {
        let portfolio = await Portfolio.findOne({ userId });

        if (!portfolio) {
            portfolio = new Portfolio({ userId, stocks: [] });
        }

        portfolio.stocks.push({ symbol, quantity, price });
        await portfolio.save();
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: "Failed to update portfolio" });
    }
});

export default router;
