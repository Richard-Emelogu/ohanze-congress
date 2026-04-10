import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">

      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">Est. August 1993</div>
          <h1>August 93 Club</h1>
          <p className="subtitle">A.K.A Ohanze Congress</p>
          <p className="motto">"Service for Advancement"</p>
          <div className="hero-buttons">
            <a href="/leadership" className="btn btn-primary">Meet Our Leaders</a>
            <a href="/store" className="btn btn-secondary">Shop Merchandise</a>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-num">1993</div>
            <div className="stat-label">Year Founded</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">30+</div>
            <div className="stat-label">Active Members</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">Ohanze</div>
            <div className="stat-label">Community</div>
          </div>
        </div>
      </div>

      <section className="about">
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <p className="section-subtitle">Who we are and what we stand for</p>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                The August 93 Club, also known as Ohanze Congress, was established to unite our
                community and preserve our rich cultural heritage. We are dedicated to service
                for advancement of all members.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">🌟</div>
              <h3>Our Vision</h3>
              <p>
                To foster community development, preserve cultural traditions, and empower our
                members through education, collaboration, and sustainable initiatives. We have
                created a fund to support these causes — donations welcome.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">🎵</div>
              <h3>Our Anthem</h3>
              <p>
                Blest be the tie that binds our hearts in fraternal love.
                The fellowship of Congressmen is like to that above.
                We share our mutual woes, our mutual burdens bear —
                our fears, our hopes, our aims are one; our comfort and our cares.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Join Our Community</h2>
          <p>Be part of a legacy that continues to build and inspire generations</p>
          <a href="/store" className="btn btn-gold btn-large">Get Your Official Polo</a>
        </div>
      </section>

    </div>
  );
}

export default Home;