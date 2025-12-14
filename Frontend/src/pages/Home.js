import React from 'react';
import './Home.css';

function Home() {
 
  
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to August 93 Club</h1>
          <p className="subtitle">A.K.A Ohanze Congress</p>
          <p className="motto">Service for Advancement</p>
          <div className="hero-buttons">
            <a href="/leadership" className="btn btn-primary">Meet Our Leaders</a>
            <a href="/store" className="btn btn-secondary">Shop Merchandise</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <h2>About Us</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>Our Mission</h3>
              <p>
                The August 93 Club, also known as Ohanze Congress, was established with a vision 
                to unite our community and preserve our rich cultural heritage. We are dedicated 
                to service for advancement of all members.
              </p>
            </div>
            <div className="about-card">
              <h3>Our Vision</h3>
              <p>
                To foster community development, preserve cultural traditions, and empower our 
                members through education, collaboration, and sustainable initiatives that 
                benefit everyone We have created a fund account for this cause and we enjoin anybody that his initiative appeals too donate towards it.
              </p>
            </div>
            <div className="about-card">
              <h3>Our Anthem</h3>
            <p>
  Blest be the tie that binds <br />
  Our hearts in fraternal love <br />
  The fellowship of Congressmen is like to that above. <br />
  <br />
  We share our mutual woes our mutual burdens bear <br />
  Our fears, our hopes, our aims are one. <br />
  Our comfort and our cares
</p>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Join Our Community</h2>
          <p>Be part of a legacy that continues to build and inspire</p>
          <a href="/store" className="btn btn-large">Get Your Official Polo</a>
        </div>
      </section>
    </div>
  );
}

export default Home;