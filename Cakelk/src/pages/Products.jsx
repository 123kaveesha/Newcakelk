import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Products.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', isAdmin: false });
  const [user, setUser] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    images: [],
    sizes: [{ size: '', price: '' }],
    flavors: [''],
    decorations: [''],
    bakerName: ''
  });
  const navigate = useNavigate();

  const categories = ['All', 'Cakes', 'Bakery', 'Birthday', 'Wedding', 'Chocolate', 'Cheese', 'Butter', 'Fruit'];
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const storedUser = localStorage.getItem('user');
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Sample initial products
      const sampleProducts = [
        {
          id: 1,
          name: 'Birthday Cake',
          description: 'Colorful birthday cake with sprinkles',
          category: 'Birthday',
          basePrice: 4500,
          images: ['https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec'],
          sizes: [
            { size: 'Small (6")', price: 4500 },
            { size: 'Medium (8")', price: 6500 }
          ],
          flavors: ['Vanilla', 'Chocolate'],
          decorations: ['Sprinkles', 'Candles'],
          bakerName: 'John Doe'
        },
        {
          id: 2,
          name: 'Croissant',
          description: 'Freshly baked butter croissants',
          category: 'Bakery',
          basePrice: 300,
          images: ['https://images.unsplash.com/photo-1589010588553-46e8e7c21788'],
          sizes: [
            { size: 'Single', price: 300 },
            { size: 'Pack of 6', price: 1500 }
          ],
          flavors: ['Butter', 'Chocolate'],
          decorations: ['None'],
          bakerName: 'Marie Baker'
        }
      ];
      setProducts(sampleProducts);
      localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin);
    }
    
    setLoading(false);
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddProduct = () => {
    setShowAddForm(!showAddForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleAdminToggle = (e) => {
    setRegisterData({ ...registerData, isAdmin: e.target.checked });
  };

  const handleAddItem = (type) => {
    setNewProduct({
      ...newProduct,
      [type]: [...newProduct[type], type === 'sizes' ? { size: '', price: '' } : '']
    });
  };

  const handleRemoveItem = (type, index) => {
    const updatedItems = newProduct[type].filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, [type]: updatedItems });
  };

  const handleItemChange = (type, index, field, value) => {
    const updatedItems = [...newProduct[type]];
    if (type === 'sizes') {
      updatedItems[index][field] = value;
    } else {
      updatedItems[index] = value;
    }
    setNewProduct({ ...newProduct, [type]: updatedItems });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, ...imageUrls]
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would verify credentials with a backend
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === loginData.email && u.password === loginData.password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(foundUser.isAdmin);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setShowLoginForm(false);
      alert('Login successful!');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === registerData.email)) {
      alert('Email already registered');
      return;
    }
    
    const newUser = {
      id: users.length + 1,
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      isAdmin: registerData.isAdmin
    };
    
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    setUser(newUser);
    setIsAdmin(newUser.isAdmin);
    localStorage.setItem('user', JSON.stringify(newUser));
    setShowRegisterForm(false);
    alert('Registration successful!');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productToAdd = {
      ...newProduct,
      id: products.length + 1,
      basePrice: Number(newProduct.basePrice),
      sizes: newProduct.sizes.map(size => ({
        size: size.size,
        price: Number(size.price)
      })),
      bakerName: user ? user.name : 'Anonymous'
    };
    
    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setShowAddForm(false);
    setNewProduct({
      name: '',
      description: '',
      category: '',
      basePrice: '',
      images: [],
      sizes: [{ size: '', price: '' }],
      flavors: [''],
      decorations: [''],
      bakerName: ''
    });
    alert('Product added successfully!');
  };

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(product => product.category === activeCategory);

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-container">
      <div className="auth-buttons">
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            {isAdmin && (
              <button onClick={handleAddProduct} className="admin-btn">
                {showAddForm ? 'Cancel' : 'Add New Product'}
              </button>
            )}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="auth-options">
            <button onClick={() => { setShowLoginForm(true); setShowRegisterForm(false); }} className="login-btn">Login</button>
            <button onClick={() => { setShowRegisterForm(true); setShowLoginForm(false); }} className="register-btn">Register</button>
          </div>
        )}
      </div>

      {showLoginForm && (
        <div className="auth-modal">
          <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Login</button>
                <button type="button" onClick={() => setShowLoginForm(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRegisterForm && (
        <div className="auth-modal">
          <div className="auth-form">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={registerData.isAdmin}
                    onChange={handleAdminToggle}
                  />
                  Register as Admin
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Register</button>
                <button type="button" onClick={() => setShowRegisterForm(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h1>Our Bakery Collection</h1>

      <div className="categories">
        {categories.map(category => (
          <button
            key={category}
            className={activeCategory === category ? 'active' : ''}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-form">
          <h2>Add New Product</h2>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Base Price (LKR):</label>
            <input
              type="number"
              name="basePrice"
              value={newProduct.basePrice}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sizes:</label>
            {newProduct.sizes.map((size, index) => (
              <div key={index} className="size-option">
                <input
                  type="text"
                  placeholder='Size (e.g., 8" or Pack of 6)'
                  value={size.size}
                  onChange={(e) => handleItemChange('sizes', index, 'size', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={size.price}
                  onChange={(e) => handleItemChange('sizes', index, 'price', e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('sizes', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem('sizes')}
              className="add-btn"
            >
              Add Size
            </button>
          </div>

          <div className="form-group">
            <label>Flavors:</label>
            {newProduct.flavors.map((flavor, index) => (
              <div key={index} className="flavor-option">
                <input
                  type="text"
                  placeholder="Flavor"
                  value={flavor}
                  onChange={(e) => handleItemChange('flavors', index, null, e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('flavors', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem('flavors')}
              className="add-btn"
            >
              Add Flavor
            </button>
          </div>

          <div className="form-group">
            <label>Decorations:</label>
            {newProduct.decorations.map((decoration, index) => (
              <div key={index} className="decoration-option">
                <input
                  type="text"
                  placeholder="Decoration"
                  value={decoration}
                  onChange={(e) => handleItemChange('decorations', index, null, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('decorations', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem('decorations')}
              className="add-btn"
            >
              Add Decoration
            </button>
          </div>

          <div className="form-group">
            <label>Images:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <div className="image-preview">
              {newProduct.images.map((image, index) => (
                <div key={index} className="preview-item">
                  <img src={image} alt={`Preview ${index}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('images', index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Save Product</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">Cancel</button>
          </div>
        </form>
      )}

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">From LKR {product.basePrice.toLocaleString()}</p>
                <p className="baker">By {product.bakerName}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">No products found in this category</div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;