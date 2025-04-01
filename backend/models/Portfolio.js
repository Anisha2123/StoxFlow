


const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User identifier
  balance: { type: Number, required: true, default: 100000 }, // ✅ Initial balance set
  stocks: [
    {
      stockSymbol: String,
      quantity: Number,
      averagePrice: Number, // Weighted average purchase price
    },
  ],
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);

