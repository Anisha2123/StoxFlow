
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Portfolio from "./components/Portfolio";
// import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import VirtualTrading from "./pages/VirtualTrading";
import TradingHistory from "./components/TradeHistory";
import StockChart from "./components/StockChart";


function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/VT" element={<VirtualTrading />} />
        <Route path="/charts" element={<StockChart />} />
        {/* <Route path="/portfolio/:userId" element={<Portfolio />} /> */}
        {/* portfolio={portfolio} userId={userId}  */}
        {/* <Route path="/signup" element={<Signup />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;


