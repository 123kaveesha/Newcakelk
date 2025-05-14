 import React, { useState, useRef } from 'react';
import './Cakemaker.css';

const App = () => {
  const [cart, setCart] = useState([]);
  const [selectedCakemaker, setSelectedCakemaker] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isCakemaker, setIsCakemaker] = useState(false);
  const [adminView, setAdminView] = useState('products');
  const [newCakemaker, setNewCakemaker] = useState({
    name: '',
    experience: '',
    location: '',
    specialty: '',
    rating: 0,
    photo: '/images/default-cakemaker.jpg',
    products: [],
    email: '',
    password: ''
  });
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: 0, 
    description: '', 
    photo: '/images/default-product.jpg' 
  });
  const [showCakemakerAuth, setShowCakemakerAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [cakemakerCredentials, setCakemakerCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const productFileInputRef = useRef(null);
  const profilePhotoInputRef = useRef(null);

  const [cakemakers, setCakemakers] = useState([
    {
      id: 1,
      name: "Master Cakemaker Kamal",
      experience: "15 years",
      location: "Colombo",
      specialty: "Artisan Breads & Wedding Cakes",
      rating: 4.9,
      photo: "/images/cm1.jpg",
      email: "kamal@example.com",
      password: "password123",
      products: [
        { 
          id: 101, 
          name: "Sourdough Loaf", 
          price: 1200, 
          description: "Traditional 24hr fermented",
          photo: "/images/sourdough.jpg" 
        },
        { 
          id: 102, 
          name: "Red Velvet Cake", 
          price: 3500, 
          description: "3-layer premium cake",
          photo: "/images/redvelvet.jpg" 
        }
      ]
    },
    {
      id: 2,
      name: "Chef Rashmi",
      experience: "8 years",
      location: "Maligawatte",
      specialty: "French Pastries",
      rating: 4.2,
      photo: "/images/cm2.jpg",
      email: "rashmi@example.com",
      password: "password123",
      products: [
        { 
          id: 201, 
          name: "Croissant", 
          price: 600, 
          description: "Buttery flaky layers",
          photo: "/images/croissant.jpg" 
        },
        { 
          id: 202, 
          name: "Macarons (6pc)", 
          price: 1200, 
          description: "Assorted flavors",
          photo: "/images/macarons.jpg" 
        }
      ]
    }
  ]);

  // Handle image upload for products
  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct(prev => ({ ...prev, photo: imageUrl }));
    }
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewCakemaker(prev => ({ ...prev, photo: imageUrl }));
    }
  };

  // Calculate rating based on experience
  const calculateRating = (experience) => {
    const years = parseInt(experience) || 0;
    if (years >= 15) return 4.9;
    if (years >= 10) return 4.7;
    if (years >= 5) return 4.3;
    return 4.0;
  };

  // Cakemaker authentication
  const handleCakemakerAuth = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      const foundCakemaker = cakemakers.find(
        c => c.email === cakemakerCredentials.email && 
             c.password === cakemakerCredentials.password
      );
      
      if (foundCakemaker) {
        setCurrentUser(foundCakemaker);
        setIsCakemaker(true);
        
        // Check if profile needs completion
        if (!foundCakemaker.name || !foundCakemaker.experience) {
          setShowProfileSetup(true);
        }
        
        setCakemakerCredentials({ email: '', password: '', confirmPassword: '' });
        setShowCakemakerAuth(false);
      } else {
        alert("Invalid credentials!");
      }
    } else {
      // Registration logic
      if (cakemakerCredentials.password !== cakemakerCredentials.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      
      if (cakemakers.some(c => c.email === cakemakerCredentials.email)) {
        alert("Email already registered!");
        return;
      }
      
      // Create basic account without profile details
      const newUser = {
        id: Date.now(),
        email: cakemakerCredentials.email,
        password: cakemakerCredentials.password,
        name: '',
        experience: '',
        location: '',
        specialty: '',
        rating: 0,
        photo: '/images/default-cakemaker.jpg',
        products: []
      };
      
      setCakemakers([...cakemakers, newUser]);
      setCurrentUser(newUser);
      setIsCakemaker(true);
      setShowProfileSetup(true);
      setCakemakerCredentials({ email: '', password: '', confirmPassword: '' });
      setShowCakemakerAuth(false);
    }
  };

  // Complete profile setup
  const completeProfileSetup = (e) => {
    e.preventDefault();
    
    const yearsExp = parseInt(newCakemaker.experience) || 0;
    const updatedUser = {
      ...currentUser,
      name: newCakemaker.name,
      experience: `${yearsExp} years`,
      location: newCakemaker.location,
      specialty: newCakemaker.specialty,
      rating: calculateRating(yearsExp),
      photo: newCakemaker.photo
    };
    
    // Update cakemakers list
    const updatedCakemakers = cakemakers.map(c => 
      c.id === currentUser.id ? updatedUser : c
    );
    
    setCakemakers(updatedCakemakers);
    setCurrentUser(updatedUser);
    setNewCakemaker({
      name: '',
      experience: '',
      location: '',
      specialty: '',
      rating: 0,
      photo: '/images/default-cakemaker.jpg',
      products: [],
      email: '',
      password: ''
    });
    setShowProfileSetup(false);
  };

  const addToCart = (product) => {
    setCart([...cart, {...product, cakemaker: selectedCakemaker.name}]);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const submitContactForm = (e) => {
    e.preventDefault();
    alert(`Message sent to ${selectedCakemaker.name}! They will contact you soon.`);
    setContactForm({ name: '', email: '', message: '' });
  };

  const addProduct = () => {
    if (!currentUser) return;
    
    const updatedCakemakers = cakemakers.map(cakemaker => {
      if (cakemaker.id === currentUser.id) {
        return {
          ...cakemaker,
          products: [...cakemaker.products, { ...newProduct, id: Date.now() }]
        };
      }
      return cakemaker;
    });
    
    setCakemakers(updatedCakemakers);
    setNewProduct({ name: '', price: 0, description: '', photo: '/images/default-product.jpg' });
    if (productFileInputRef.current) {
      productFileInputRef.current.value = '';
    }
  };

  const removeProduct = (productId) => {
    if (!currentUser) return;
    
    const updatedCakemakers = cakemakers.map(cakemaker => {
      if (cakemaker.id === currentUser.id) {
        return {
          ...cakemaker,
          products: cakemaker.products.filter(product => product.id !== productId)
        };
      }
      return cakemaker;
    });
    
    setCakemakers(updatedCakemakers);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Sri Lankan Cake Masters</h1>
          <p>Discover Sri Lanka's finest baking talents</p>
        </div>
        <div className="header-actions">
          {!isCakemaker && (
            <button 
              className="cakemaker-toggle" 
              onClick={() => setShowCakemakerAuth(true)}
            >
              Cakemaker Login/Register
            </button>
          )}
          {isCakemaker && (
            <div className="cakemaker-header-info">
              <span>Logged in as: {currentUser?.name || currentUser?.email}</span>
              <button 
                className="exit-cakemaker-btn" 
                onClick={() => {
                  setIsCakemaker(false);
                  setCurrentUser(null);
                }}
              >
                Logout
              </button>
            </div>
          )}
          <div className="cart-icon" onClick={() => setSelectedCakemaker(null)}>
            🛒 {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </div>
        </div>
      </header>

      {showCakemakerAuth && (
        <div className="cakemaker-auth-modal">
          <div className="cakemaker-auth-container">
            <h2>{isLogin ? 'Cakemaker Login' : 'Cakemaker Registration'}</h2>
            <form onSubmit={handleCakemakerAuth}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={cakemakerCredentials.email}
                  onChange={(e) => setCakemakerCredentials({...cakemakerCredentials, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={cakemakerCredentials.password}
                  onChange={(e) => setCakemakerCredentials({...cakemakerCredentials, password: e.target.value})}
                  required
                />
              </div>
              {!isLogin && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={cakemakerCredentials.confirmPassword}
                    onChange={(e) => setCakemakerCredentials({...cakemakerCredentials, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              )}
              <button type="submit" className="auth-submit-btn">
                {isLogin ? 'Login' : 'Register'}
              </button>
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Need to register?' : 'Already have an account?'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showProfileSetup && currentUser && (
        <div className="profile-setup-modal">
          <div className="profile-setup-container">
            <h2>Complete Your Profile</h2>
            <p>Please provide some additional information to set up your cakemaker profile.</p>
            
            <form onSubmit={completeProfileSetup}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newCakemaker.name}
                  onChange={(e) => setNewCakemaker({...newCakemaker, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    value={newCakemaker.experience}
                    onChange={(e) => setNewCakemaker({...newCakemaker, experience: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newCakemaker.location}
                    onChange={(e) => setNewCakemaker({...newCakemaker, location: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Specialty</label>
                <input
                  type="text"
                  value={newCakemaker.specialty}
                  onChange={(e) => setNewCakemaker({...newCakemaker, specialty: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={profilePhotoInputRef}
                  onChange={handleProfilePhotoUpload}
                />
                {newCakemaker.photo && (
                  <div className="image-preview">
                    <img src={newCakemaker.photo} alt="Profile preview" />
                  </div>
                )}
              </div>
              
              <button type="submit" className="save-profile-btn">
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {isCakemaker ? (
        <div className="cakemaker-panel">
          <div className="cakemaker-sidebar">
            <div className="cakemaker-header">
              <h3>Cakemaker Panel</h3>
              {currentUser?.photo && (
                <div className="cakemaker-avatar">
                  <img src={currentUser.photo} alt="Profile" />
                </div>
              )}
            </div>
            <nav className="cakemaker-nav">
              <button 
                className={adminView === 'products' ? 'active' : ''}
                onClick={() => setAdminView('products')}
              >
                My Products
              </button>
              <button 
                className={adminView === 'orders' ? 'active' : ''}
                onClick={() => setAdminView('orders')}
              >
                My Orders
              </button>
              <button 
                className={adminView === 'profile' ? 'active' : ''}
                onClick={() => setAdminView('profile')}
              >
                My Profile
              </button>
            </nav>
          </div>
          
          <div className="cakemaker-content">
            {adminView === 'products' && (
              <div className="cakemaker-section">
                <h2>Manage My Products</h2>
                
                <div className="add-product-form">
                  <h3>Add New Product</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input 
                        type="text" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Price (LKR)</label>
                      <input 
                        type="number" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Product Photo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={productFileInputRef}
                      onChange={handleProductImageUpload}
                    />
                    {newProduct.photo && (
                      <div className="image-preview">
                        <img src={newProduct.photo} alt="Product preview" />
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="add-btn"
                    onClick={addProduct}
                    disabled={!newProduct.name || !newProduct.price}
                  >
                    Add Product
                  </button>
                </div>
                
                <div className="products-list">
                  <h3>My Current Products</h3>
                  {currentUser?.products?.length > 0 ? (
                    <div className="products-grid">
                      {currentUser.products.map(product => (
                        <div key={product.id} className="cakemaker-product-card">
                          <div className="product-image">
                            <img src={product.photo} alt={product.name} />
                          </div>
                          <div className="product-info">
                            <h5>{product.name}</h5>
                            <p><strong>Price:</strong> LKR {product.price}</p>
                            <p><strong>Description:</strong> {product.description}</p>
                          </div>
                          <button 
                            className="remove-btn"
                            onClick={() => removeProduct(product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-products">No products added yet</p>
                  )}
                </div>
              </div>
            )}
            
            {adminView === 'orders' && (
              <div className="cakemaker-section">
                <h2>My Recent Orders</h2>
                {cart.filter(item => item.cakemaker === currentUser?.name).length > 0 ? (
                  <div className="orders-list">
                    <div className="orders-header">
                      <span>Product</span>
                      <span>Price</span>
                      <span>Customer</span>
                    </div>
                    {cart
                      .filter(item => item.cakemaker === currentUser?.name)
                      .map((item, index) => (
                        <div key={index} className="order-item">
                          <span>{item.name}</span>
                          <span>LKR {item.price}</span>
                          <span>{contactForm.name || 'Anonymous'}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="no-orders">No orders yet</p>
                )}
              </div>
            )}
            
            {adminView === 'profile' && currentUser && (
              <div className="cakemaker-section">
                <h2>My Profile</h2>
                <div className="profile-view">
                  <div className="profile-photo">
                    <img src={currentUser.photo} alt="Profile" />
                  </div>
                  <div className="profile-details">
                    <h3>{currentUser.name}</h3>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                    <p><strong>Location:</strong> {currentUser.location}</p>
                    <p><strong>Specialty:</strong> {currentUser.specialty}</p>
                    <p><strong>Experience:</strong> {currentUser.experience}</p>
                    <p><strong>Rating:</strong> {currentUser.rating} ★</p>
                  </div>
                </div>
                <button 
                  className="edit-profile-btn"
                  onClick={() => {
                    setNewCakemaker({
                      ...currentUser,
                      experience: currentUser.experience.replace(' years', '')
                    });
                    setShowProfileSetup(true);
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <main className="main-content">
          {!selectedCakemaker ? (
            <div className="cakemakers-grid">
              {cakemakers.map((cakemaker) => (
                <div key={cakemaker.id} className="cakemaker-card" onClick={() => setSelectedCakemaker(cakemaker)}>
                  <div className="cakemaker-image" style={{ backgroundImage: `url(${cakemaker.photo})` }}>
                    <div className="rating">{cakemaker.rating} ★</div>
                  </div>
                  <div className="cakemaker-details">
                    <h3>{cakemaker.name}</h3>
                    <p className="specialty">{cakemaker.specialty}</p>
                    <div className="location-exp">
                      <span>📍 {cakemaker.location}</span>
                      <span>👨‍🍳 {cakemaker.experience}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cakemaker-profile">
              <button className="back-button" onClick={() => setSelectedCakemaker(null)}>
                &larr; Back to Cakemakers
              </button>
              
              <div className="profile-header">
                <div className="profile-image" style={{ backgroundImage: `url(${selectedCakemaker.photo})` }}></div>
                <div className="profile-info">
                  <h2>{selectedCakemaker.name}</h2>
                  <div className="meta-info">
                    <span className="rating">{selectedCakemaker.rating} ★</span>
                    <span>📍 {selectedCakemaker.location}</span>
                    <span>👨‍🍳 {selectedCakemaker.experience}</span>
                  </div>
                  <p className="specialty">{selectedCakemaker.specialty}</p>
                  <p className="bio">
                    Master cakemaker specializing in {selectedCakemaker.specialty.toLowerCase()} with {selectedCakemaker.experience} of professional experience. 
                    Trained in traditional techniques with a modern twist.
                  </p>
                </div>
              </div>

              <div className="products-section">
                <h3>Signature Creations</h3>
                <div className="products-grid">
                  {selectedCakemaker.products.map((product) => (
                    <div key={product.id} className="product-card">
                      <div 
                        className="product-image" 
                        style={{ backgroundImage: `url(${product.photo})` }}
                      ></div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="description">{product.description}</p>
                        <p className="price">LKR {product.price.toLocaleString()}</p>
                      </div>
                      <button className="add-to-cart" onClick={() => addToCart(product)}>+ Add</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="contact-section">
                <h3>Contact {selectedCakemaker.name}</h3>
                <form onSubmit={submitContactForm}>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={contactForm.name} 
                      onChange={handleContactChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={contactForm.email} 
                      onChange={handleContactChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea 
                      name="message" 
                      value={contactForm.message} 
                      onChange={handleContactChange} 
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="send-message-btn">Send Message</button>
                </form>
              </div>
            </div>
          )}
        </main>
      )}

      {cart.length > 0 && !isCakemaker && (
        <div className="cart-preview">
          <h4>Your Cart ({cart.length})</h4>
          <div className="cart-items">
            {cart.slice(0, 3).map((item, index) => (
              <div key={index} className="cart-item">
                <span>{item.name}</span>
                <span>LKR {item.price}</span>
              </div>
            ))}
            {cart.length > 3 && <div className="more-items">+{cart.length - 3} more</div>}
          </div>
          <button className="view-cart-btn">View Full Cart</button>
        </div>
      )}
    </div>
  );
};

export default App;