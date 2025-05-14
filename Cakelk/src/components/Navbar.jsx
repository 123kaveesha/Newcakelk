 import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import logo from '../images/logo.png';  // Assuming this is in src/images
// No import for search icon from public folder anymore
import cart_icon from '../images/cart.png';  // Assuming this is in src/images

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

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
            <li><Link to="/products" className="nav-link">Products</Link></li>
            {user && <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>}
          </ul>
        </div>
        
        <div className="nav-right">
          <div className='search-box'>
            <input type="text" placeholder="Search..." />
            <button className="search-button">
              {/* Direct URL reference to the image in the public folder */}
              <img src="/images/search.png" alt="Search" />
            </button>
          </div>
          
          <Link to="/cart" className="cart-icon">
            <img src={cart_icon} alt="Cart" />
            <span className="cart-count">0</span>
          </Link>
          
          {user ? (
            <div className="user-dropdown">
              <span className="user-greeting">Hi, {user.name}</span>
              <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-button">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
