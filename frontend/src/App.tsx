
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import Portfolio from "./pages/Portfolio";
import News from "./pages/News";
// import Login from "./component/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import StockPrice from "./components/StockPrice";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;


