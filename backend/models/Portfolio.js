

import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    stocks: [{ symbol: String, quantity: Number, price: Number }],
});

export default mongoose.model("Portfolio", PortfolioSchema);
