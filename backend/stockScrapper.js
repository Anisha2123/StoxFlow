

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const scrapeStockData = async (symbol) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  try {
    await page.goto(`https://www.nseindia.com/get-quotes/equity?symbol=${symbol}`, { waitUntil: "networkidle2", timeout: 60000 });

    await page.waitForSelector(".securityInfo span", { timeout: 10000 }); // Ensure element loads

    const stockPrice = await page.$eval(".securityInfo span", (el) => el.innerText);

    await browser.close();
    return { symbol, price: `₹${stockPrice}` };
  } catch (error) {
    console.error(`Error fetching stock data:`, error.message);
    await browser.close();
    return { symbol, price: "N/A" };
  }
};

scrapeStockData("TCS").then(console.log);


// Export the function so it can be used in server.js
module.exports = scrapeStockData;
