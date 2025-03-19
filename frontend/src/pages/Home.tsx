
// import StockPrice from "../components/StockPrice";
import Dashboard from "../components/Dasboard";
import StockChart from "../components/StockChart";
const Home = () => {

    const stocks = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "SBIN"]; // List of NSE Stocks

    return (
         <div>
      {/* <Dashboard /> */}
      <StockChart symbol="AAPL" />

    </div>
    )
   
  };
  
  export default Home;
  