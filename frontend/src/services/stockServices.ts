



import axios from "axios";

export const getIndianStockData = async (symbol: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/stock/${symbol}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data", error);
    return null;
  }
};



