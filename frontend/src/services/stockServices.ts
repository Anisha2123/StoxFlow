



import axios from "axios";

export const getIndianStockData = async (symbol: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/stock/${symbol}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data", error);
    return null;
  }
};



