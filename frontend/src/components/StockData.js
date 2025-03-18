

import React, { useState } from "react";
import axios from "axios";

const StockData = () => {
    const [symbol, setSymbol] = useState("");
    const [data, setData] = useState(null);

    const fetchStock = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/stock/${symbol}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching stock data", error);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Enter Stock Symbol" onChange={(e) => setSymbol(e.target.value)} />
            <button onClick={fetchStock}>Fetch Stock Data</button>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

export default StockData;
