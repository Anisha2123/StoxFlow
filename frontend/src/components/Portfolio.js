

import React, { useState } from "react";
import axios from "axios";

const Portfolio = () => {
    const [userId, setUserId] = useState("user123");
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");

    const addStock = async () => {
        try {
            await axios.post("http://localhost:5000/portfolio/add", { userId, symbol, quantity, price });
            alert("Stock added successfully");
        } catch (error) {
            console.error("Error adding stock", error);
        }
    };

    return (
        <div>
            <h2>Portfolio</h2>
            <input type="text" placeholder="Stock Symbol" onChange={(e) => setSymbol(e.target.value)} />
            <input type="number" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
            <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
            <button onClick={addStock}>Add to Portfolio</button>
        </div>
    );
};

export default Portfolio;
