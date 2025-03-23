


const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User identifier
  stocks: [
    {
      stockSymbol: String,
      quantity: Number,
      averagePrice: Number, // Weighted average purchase price
    },
  ],
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);

