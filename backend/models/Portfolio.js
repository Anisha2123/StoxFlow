


// const mongoose = require("mongoose");

// const PortfolioSchema = new mongoose.Schema({
//   userId: { type: String, required: true }, // User identifier
//   balance: { type: Number, required: true, default: 100000 }, // ✅ Initial balance set
//   stocks: [
//     {
//       stockSymbol: String,
//       quantity: Number,
//       averagePrice: Number, // Weighted average purchase price
//       marketPrice: Number,  // Store the current market price
//     },
//   ],
// });

// module.exports = mongoose.model("Portfolio", PortfolioSchema);

const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User identifier
  balance: { type: Number, required: true, default: 100000 }, // ✅ Initial balance set
  stocks: [
    {
      stockSymbol: String,
      quantity: Number,
      averagePrice: Number, // Weighted average purchase price
      marketPrice: Number,  // Store the current market price
      totalInvested: Number, // Total money invested in this stock
      currentValue: Number,  // Current value based on market price
      totalReturns: Number,  // Profit or loss from this stock
      returnPercentage: Number // Percentage return on this stock
    },
  ],
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);


