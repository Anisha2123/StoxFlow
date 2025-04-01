

const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");

// Get User Portfolio
router.get("/:userId", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    res.json(portfolio || { userId: req.params.userId, stocks: [] });
  } catch (error) {
    res.status(500).json({ error: "Error fetching portfolio" });
  }
});


// router.post("/update-portfolio/:userId", async (req, res) => {
//   console.log("✅ API Called: Update Portfolio");
//   console.log("🔹 Request Params:", req.params);
//   console.log("🔹 Request Body:", req.body);

//   const { stockSymbol, quantity, marketPrice, tradeType } = req.body;
//   const userId = req.params.userId; // ✅ Get user ID from params

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     let portfolio = await Portfolio.findOne({ userId });

//     if (!portfolio) {
//       console.log("🔹 No existing portfolio found. Creating new one.");
//       portfolio = new Portfolio({ userId, stocks: [] });
//     }
//     let totalAmount = quantity * marketPrice;
//     let stockIndex = portfolio.stocks.findIndex((s) => s.stockSymbol === stockSymbol);

//     if (tradeType === "buy") {
//       if (portfolio.balance < totalAmount) {
//         console.log("🔴 Insufficient balance!");
//         return res.status(400).json({ error: "Insufficient balance" });
//       }
//       portfolio.balance -= totalAmount; // ✅ Deduct balance on buy

//       if (stockIndex >= 0) {
//         // ✅ Update quantity and recalculate average price
//         let stock = portfolio.stocks[stockIndex];
//         let totalCost = stock.quantity * stock.averagePrice + quantity * marketPrice;
//         stock.quantity += quantity;
//         stock.averagePrice = totalCost / stock.quantity;
//       } else {
//         // ✅ New stock entry
//         console.log("🔹 Adding new stock:", stockSymbol);
//         portfolio.stocks.push({ stockSymbol, quantity, averagePrice: marketPrice });
//       }
//     } else if (tradeType === "sell") {
//       if (stockIndex >= 0) {
//         let stock = portfolio.stocks[stockIndex];

//         if (stock.quantity >= quantity) {
//           stock.quantity -= quantity;
//           portfolio.balance += totalAmount; // ✅ Add balance on sell
//           console.log(`🔹 Selling ${quantity} shares of ${stockSymbol}. Remaining: ${stock.quantity}`);

//           if (stock.quantity === 0) {
//             console.log("🔹 Stock fully sold. Removing from portfolio.");
//             portfolio.stocks.splice(stockIndex, 1);
//           }
//         } else {
//           console.log("🔴 Not enough shares to sell!");
//           return res.status(400).json({ error: "Not enough shares to sell" });
//         }
//       } else {
//         console.log("🔴 Stock not found in portfolio for selling!");
//         return res.status(400).json({ error: "Stock not found in portfolio" });
//       }
//     }

//      // Calculate Total Invested & Current Total Amount
//      let totalInvested = 0;
//      let currentTotalAmount = 0;
     
//      portfolio.stocks.forEach((stock) => {
//        totalInvested += stock.quantity * stock.averagePrice;
//        currentTotalAmount += stock.quantity * marketPrice; 
//      });
 
//      let totalReturns = currentTotalAmount - totalInvested;
//      let returnPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
 
//      portfolio.totalInvested = totalInvested;
//      portfolio.currentTotalAmount = currentTotalAmount;
//      portfolio.totalReturns = totalReturns;
//      portfolio.returnPercentage = returnPercentage;

//     await portfolio.save();
//     console.log("✅ Portfolio Updated:", portfolio);

//     res.json({ message: "Portfolio updated", portfolio });
//   } catch (error) {
//     console.error("❌ Error updating portfolio:", error);
//     res.status(500).json({ error: "Error updating portfolio" });
//   }
// });


// module.exports = router;


router.post("/update-portfolio/:userId", async (req, res) => {
  console.log("✅ API Called: Update Portfolio");
  // console.log("🔹 Request Params:", req.params);
 

  const { stockSymbol, quantity, marketPrice, tradeType } = req.body;
  const userId = req.params.userId; 
  // console.log("🔹 Request Body:", stockSymbol);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      console.log("🔹 No existing portfolio found. Creating new one.");
      portfolio = new Portfolio({ userId, stocks: [], balance: 100000 });
    }

    let stockIndex = portfolio.stocks.findIndex((s) => s.stockSymbol === stockSymbol);
    console.log("stockIndex " ,stockIndex);
    console.log("📊 Market Price for", stockSymbol, ":", marketPrice);
    console.log("marketprice is ", marketPrice);

    if (tradeType === "buy") {
      let cost = quantity * marketPrice;
      
      console.log("buy");

      if (portfolio.balance < cost) {
        return res.status(400).json({ error: "Not enough balance to buy!" });
      }

      portfolio.balance -= cost;
     

      if (stockIndex >= 0) {
        let stock = portfolio.stocks[stockIndex];
       
        let totalCost = stock.quantity * stock.averagePrice + cost;
        console.log(totalCost);
        stock.quantity += quantity;
        stock.averagePrice = totalCost / stock.quantity;
        stock.marketPrice = cost;
        stock.totalInvested = stock.quantity * stock.averagePrice;
        stock.currentValue = stock.quantity * marketPrice;
        stock.totalReturns = stock.currentValue - stock.totalInvested;
        stock.returnPercentage = (stock.totalReturns / stock.totalInvested) * 100;
      } else {
        console.log("🔹 Adding new stock:", stockSymbol);
        portfolio.stocks.push({
          stockSymbol,
          quantity,
          averagePrice: marketPrice,
          marketPrice,
          totalInvested: quantity * marketPrice,
          currentValue: quantity * marketPrice,
          totalReturns: 0,
          returnPercentage: 0
        });
      }
    } else if (tradeType === "sell") {
      if (stockIndex >= 0) {
        let stock = portfolio.stocks[stockIndex];
        console.log("buy");

        if (stock.quantity >= quantity) {
          let sellAmount = quantity * marketPrice;
          portfolio.balance += sellAmount;

          stock.quantity -= quantity;
          stock.marketPrice = marketPrice;
          stock.totalInvested = stock.quantity * stock.averagePrice;
          stock.currentValue = stock.quantity * marketPrice;
          stock.totalReturns = stock.currentValue - stock.totalInvested;
           // Calculate returnPercentage only if totalInvested is greater than 0
           if (stock.totalInvested > 0) {
            stock.returnPercentage = (stock.totalReturns / stock.totalInvested) * 100;
          } else {
            stock.returnPercentage = 0;
          }
          console.log(`🔹 Selling ${quantity} shares of ${stockSymbol}. Remaining: ${stock.quantity}`);

          if (stock.quantity === 0) {
            console.log("🔹 Stock fully sold. Removing from portfolio.");
            portfolio.stocks.splice(stockIndex, 1);
          }
        } else {
          return res.status(400).json({ error: "Not enough shares to sell" });
        }
      } else {
        return res.status(400).json({ error: "Stock not found in portfolio" });
      }
    }

    await portfolio.save();
    // console.log("✅ Portfolio Updated:", portfolio);
  
    res.json({ message: "Portfolio updated", portfolio });
  } catch (error) {
    console.error("❌ Error updating portfolio:", error);
    res.status(500).json({ error: "Error updating portfolio" });
  }
});

// router.post("/update-portfolio/:userId", async (req, res) => {
//   console.log("✅ API Called: Update Portfolio");
//   console.log("🔹 Request Params:", req.params);
//   console.log("🔹 Request Body:", req.body);

//   const { stockSymbol, quantity, marketPrice, tradeType } = req.body;
//   const userId = req.params.userId; // ✅ Get user ID from params

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     let portfolio = await Portfolio.findOne({ userId });

//     if (!portfolio) {
//       console.log("🔹 No existing portfolio found. Creating new one.");
//       portfolio = new Portfolio({ userId, stocks: [] });
//     }
//     let totalAmount = quantity * marketPrice;
//     let stockIndex = portfolio.stocks.findIndex((s) => s.stockSymbol === stockSymbol);

//     if (tradeType === "buy") {
//       if (portfolio.balance < totalAmount) {
//         console.log("🔴 Insufficient balance!");
//         return res.status(400).json({ error: "Insufficient balance" });
//       }
//       portfolio.balance -= totalAmount; // ✅ Deduct balance on buy

//       if (stockIndex >= 0) {
//         // ✅ Update quantity and recalculate average price
//         let stock = portfolio.stocks[stockIndex];
//         let totalCost = stock.quantity * stock.averagePrice + quantity * marketPrice;
//         stock.quantity += quantity;
//         stock.averagePrice = totalCost / stock.quantity;
//       } else {
//         // ✅ New stock entry
//         console.log("🔹 Adding new stock:", stockSymbol);
//         portfolio.stocks.push({ stockSymbol, quantity, averagePrice: marketPrice });
//       }
//     } else if (tradeType === "sell") {
//       if (stockIndex >= 0) {
//         let stock = portfolio.stocks[stockIndex];

//         if (stock.quantity >= quantity) {
//           stock.quantity -= quantity;
//           portfolio.balance += totalAmount; // ✅ Add balance on sell
//           console.log(`🔹 Selling ${quantity} shares of ${stockSymbol}. Remaining: ${stock.quantity}`);

//           if (stock.quantity === 0) {
//             console.log("🔹 Stock fully sold. Removing from portfolio.");
//             portfolio.stocks.splice(stockIndex, 1);
//           }
//         } else {
//           console.log("🔴 Not enough shares to sell!");
//           return res.status(400).json({ error: "Not enough shares to sell" });
//         }
//       } else {
//         console.log("🔴 Stock not found in portfolio for selling!");
//         return res.status(400).json({ error: "Stock not found in portfolio" });
//       }
//     }

//     await portfolio.save();
//     console.log("✅ Portfolio Updated:", portfolio);

//     res.json({ message: "Portfolio updated", portfolio });
//   } catch (error) {
//     console.error("❌ Error updating portfolio:", error);
//     res.status(500).json({ error: "Error updating portfolio" });
//   }
// });


router.get("/get-portfolio/:userId", async (req, res) => {
  console.log("✅ API Called: Get Portfolio");

  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      console.log("🔹 No portfolio found for user:", userId);
      return res.json({
        portfolio: {
          balance: 100000,
          stocks: [],
          totalInvested: 0,
          currentValue: 0,
          totalReturns: 0,
          returnPercentage: 0,
        },
      });
    }

    let totalInvested = 0;
    let currentValue = 0;

    portfolio.stocks.forEach(stock => {
      const totalInvestedForStock = stock.quantity * stock.averagePrice;
      const currentValueForStock = stock.quantity * stock.marketPrice;

      totalInvested += totalInvestedForStock;
      currentValue += currentValueForStock;

      stock.totalInvested = totalInvestedForStock;
      stock.currentValue = currentValueForStock;
      stock.totalReturns = currentValueForStock - totalInvestedForStock;
      stock.returnPercentage = totalInvestedForStock > 0 
        ? ((stock.totalReturns / totalInvestedForStock) * 100).toFixed(2) 
        : 0;
    });

    let totalReturns = currentValue - totalInvested;
    let returnPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0;

    console.log("📌 Portfolio Data Calculated:", { totalInvested, currentValue, totalReturns });

    res.json({
      portfolio: {
        ...portfolio.toObject(), // Ensuring MongoDB object is properly formatted
        totalInvested,
        currentValue,
        totalReturns,
        returnPercentage,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching portfolio:", error);
    res.status(500).json({ error: "Error fetching portfolio" });
  }
});




module.exports = router;