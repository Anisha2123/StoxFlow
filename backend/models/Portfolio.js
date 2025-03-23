


const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stocks: [
    {
      stockSymbol: String,
      stockName: String,
      quantity: Number,
      averagePrice: Number,
      totalValue: Number,
    },
  ],
  balance: { type: Number, default: 100000 }, // Default virtual money
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
