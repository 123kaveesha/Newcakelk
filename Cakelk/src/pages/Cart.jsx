import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const CartPage = () => {
  // Retrieve cart items from localStorage or state management
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 500; // Example delivery fee
  const total = subtotal + deliveryFee;

  // Handle quantity changes
  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.location.reload(); // Refresh to show changes
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.location.reload(); // Refresh to show changes
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>Review and proceed to checkout</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-content">
            <img src="/images/empty-cart.svg" alt="Empty cart" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items yet</p>
            <Link to="/browse" className="browse-btn">
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            <div className="cart-items-header">
              <h2>Your Items ({cartItems.length})</h2>
            </div>
            
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.photo} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">
                    {item.category === 'cakes' ? 'Cake' : 'Bakery Item'}
                  </p>
                  <div className="item-price">LKR {item.price.toLocaleString()}</div>
                </div>
                <div className="item-quantity">
                  <select 
                    value={item.quantity || 1}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="item-total">
                  LKR {(item.price * (item.quantity || 1)).toLocaleString()}
                </div>
                <button 
                  className="remove-item"
                  onClick={() => removeItem(item.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>LKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>LKR {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>
            
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
            
            <Link to="/browse" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;