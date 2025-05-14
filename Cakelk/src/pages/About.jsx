import React from 'react';
import './About.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <h1>Our Sweet Story</h1>
          <p>Connecting cake lovers with talented bakers across Sri Lanka</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <h2>Our Mission</h2>
          <div className="mission-content">
            <div className="mission-text">
              <p>
                At CakeHub, we're revolutionizing the way Sri Lankans buy and sell cakes. 
                Our platform bridges the gap between talented home bakers and cake enthusiasts, 
                creating opportunities for small businesses while giving customers access to 
                unique, high-quality baked goods.
              </p>
              <p>
                Founded in 2024, we started with a simple idea: everyone deserves access to 
                beautiful, delicious cakes no matter where they live in Sri Lanka.
              </p>
            </div>
            <div className="mission-gallery">
              {[
                { id: 1, photo: "/images/a1.jpg", alt: "Bakers preparing cake" },
                { id: 2, photo: "/images/a2.jpg", alt: "Cake decorating" },
                { id: 3, photo: "/images/a3.jpg", alt: "Team meeting" },
                { id: 4, photo: "/images/a4.jpg", alt: "Customer enjoying cake" }
              ].map((image, index) => (
                <div 
                  key={image.id}
                  className={`gallery-image ${index === 0 ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${image.photo})` }}
                  aria-label={image.alt}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Quality</h3>
              <p>We maintain high standards for all products listed on our platform, ensuring every cake meets customer expectations.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community</h3>
              <p>We believe in supporting local bakers and helping them grow their businesses through our platform.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Innovation</h3>
              <p>Our 3D customization tools and event visualization set us apart in the online cake marketplace.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Trust</h3>
              <p>Transparent ratings, reviews, and secure payments build confidence between buyers and sellers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p className="team-subtitle">The passionate people behind CakeHub</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/images/Denu.JPG" alt="Founder" />
              </div>
              <h3>Denuwan Perera</h3>
              <p className="position">Founder & CEO</p>
              <p className="bio">Pastry chef turned entrepreneur with a vision to connect Sri Lanka's baking talent with customers nationwide.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team2.jpg" alt="Tech Lead" />
              </div>
              <h3>Nadeesha Perera</h3>
              <p className="position">Tech Lead</p>
              <p className="bio">Developed our innovative 3D cake customization platform and seamless ordering system.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team3.jpg" alt="Marketing" />
              </div>
              <h3>Chamari Silva</h3>
              <p className="position">Marketing Director</p>
              <p className="bio">Helping rural bakers establish their brands and reach new customers across the island.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Join Our Growing Community</h2>
          <p>Whether you're a baker looking to reach more customers or a cake lover searching for something special, we'd love to have you!</p>
          <div className="cta-buttons">
            <a href="/login" className="btn btn-primary">Register as a Baker</a>
            <a href="/login" className="btn btn-secondary">Sign Up as Customer</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;