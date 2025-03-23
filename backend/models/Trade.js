

const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ✅ Ensure userId is included  userId: { type: String, required: true }, // ✅ Ensure userId is included
  stockSymbol: { type: String, required: true },
  marketPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  tradeType: { type: String, enum: ["buy", "sell"], required: true },
  timestamp: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Trade", tradeSchema);



