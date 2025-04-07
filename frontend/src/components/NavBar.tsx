import { useState } from "react";
import { Link } from "react-router-dom";
// import Portfolio from "./Portfolio";
import "../App.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">StockPro</h1>

       

        {/* Navigation Links */}
        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li><Link to="/home" className="nav-item" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/charts" className="nav-item" onClick={() => setIsOpen(false)}>StockChart</Link></li>
          <li><Link to="/portfolio" className="nav-item" onClick={() => setIsOpen(false)}>Portfolio</Link></li>
          <li><Link to="/VT" className="nav-item" onClick={() => setIsOpen(false)}>Virtual Trading</Link></li>
        </ul>

        <button className="login-btn">Login</button>
         {/* Hamburger Icon */}
         <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


