import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from './../../public/images/logo.png';
import search_icon from './../../public/images/search.png';
import cart_icon from './../../public/images/cart.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <img src={logo} alt="Company Logo" />
        </div>
        
        <div className="nav-middle">
          <ul className="nav-links">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
            <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
            <li><Link to="/Products" className="nav-link">Products</Link></li>
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
          </ul>
        </div>
        
        <div className="nav-right">
          <div className='search-box'>
            <input type="text" placeholder="Search..." />
            <button className="search-button">
              <img src={search_icon} alt="Search" />
            </button>
          </div>
          
          <Link to="/cart" className="cart-icon">
            <img src={cart_icon} alt="Cart" />
            <span className="cart-count">0</span>
          </Link>
          
          <Link to="/login" className="login-button">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;