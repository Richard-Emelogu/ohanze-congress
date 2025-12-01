import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import logo from '../assets/images/logo.jpg';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-section">
          <img src={logo} alt="August 93 Club Logo" className="logo" />
          <div className="logo-text">
            <h1>August 93 Club</h1>
            <p>A.K.A Ohanze Congress</p>
          </div>
        </Link>

       <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
  <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
  <Link to="/leadership" onClick={() => setMenuOpen(false)}>Leadership</Link>
  <Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
  <Link to="/store" onClick={() => setMenuOpen(false)}>Store</Link>
  <Link to="/admin/login" onClick={() => setMenuOpen(false)} style={{color: '#fecaca'}}>Admin</Link>
</nav>

        <div className="header-right">
          <Link to="/store" className="cart-icon">
            <ShoppingCart size={24} />
          </Link>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;