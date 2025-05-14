import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
 
const HomePage = () => {
  return (
    <div className="homepage">
    {/* Hero Section */}
<section className="hero">
  <div className="container">
    <div className="hero-content">
      <h1>Discover & Customize Perfect Cakes</h1>
      <p>Connecting you with talented bakers across the country</p>
      <div className="cta-buttons">
        <Link to="/customize" className="primary-btn">Design Your Cake</Link>
        <Link to="/browse" className="secondary-btn">Browse Collections</Link>
        <Link to="/cakemaker" className="secondary-btn">Cake makers</Link>
      </div>
    </div>
    <div className="hero-gallery">
      {[
        { id: 1, photo: "/images/hero2.jpg", alt: "Wedding Cake Design" },
        { id: 2, photo: "/images/hero1.jpg", alt: "Birthday Cake Design" },
        { id: 3, photo: "/images/hero3.jpg", alt: "Anniversary Cake" },
        { id: 4, photo: "/images/hero4.jpg", alt: "Custom Fondant Cake" }
      ].map((image, index) => (
        <div 
          key={image.id}
          className={`hero-image ${index === 0 ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image.photo})` }}
          aria-label={image.alt}
        ></div>
      ))}
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose CakeConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon">🎂</div>
              <h3>Custom Designs</h3>
              <p>Create your dream cake with our 3D customization tool</p>
            </div>
            <div className="feature-card">
              <div className="icon">📍</div>
              <h3>Local Bakers</h3>
              <p>Connect with talented bakers in your area</p>
            </div>
            <div className="feature-card">
              <div className="icon">👩‍🍳</div>
              <h3>Verified Experts</h3>
              <p>Choose from certified and experienced cake makers</p>
            </div>
            <div className="feature-card">
              <div className="icon">🚚</div>
              <h3>Reliable Delivery</h3>
              <p>Fresh cakes delivered to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cakes Section */}
<section className="popular-cakes">
  <div className="container">
    <h2>Popular Cake Designs</h2>
    <div className="cakes-grid">
      {[
        { id: 1, name: "A Gentleman's Cake", photo: "/images/pop1.jpg", rating: 4.5 },
        { id: 2, name: "Birthday Cake", photo: "/images/pop2.jpg", rating: 4.8 },
        { id: 3, name: "Wedding Classic", photo: "/images/pop3.jpg", rating: 4.7 },
        { id: 4, name: "Buttercream Dream", photo: "/images/pop5.jpg", rating: 4.6 }
      ].map((cake) => (
        <div className="cake-card" key={cake.id}>
          <img src={cake.photo} alt={cake.name} />
          <div className="cake-info">
            <h3>{cake.name}</h3>
            <div className="rating">
              {'★'.repeat(Math.floor(cake.rating))}
              {'☆'.repeat(5 - Math.floor(cake.rating))}
              <span>({cake.rating.toFixed(1)})</span>
            </div>
            <Link to="/Customize" className="customize-btn">Customize This</Link>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Create Your Perfect Cake?</h2>
          <p>Start designing now or browse our baker collections</p>
          <div className="cta-buttons">
            <Link to="/customize" className="primary-btn">Start Designing</Link>
            <Link to="/bakers" className="secondary-btn">Find a Baker</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;