import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'http://localhost:5000/dashboard.html';
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please make sure the backend server is running.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <div className="admin-icon">🔐</div>
          <h1 className="admin-title">Admin Login</h1>
          <p className="admin-subtitle">August 93 Club - Ohanze Congress</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              📧 Admin Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              🔑 Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🚀 Login to Dashboard'}
          </button>
        </form>

        {
        // <div className="admin-info">
        //   <div className="info-box">
        //     <h3>📝 Default Credentials</h3>
        //     <p><strong>Email:</strong> admin@ohanze.com</p>
        //     <p><strong>Password:</strong> admin123</p>
        //   </div>
        // </div>
        }

        <div className="info-note-standalone">
          <p>⚠️ Make sure your backend server is running on port 5000</p>
        </div>

        <div className="quick-access">
          <p>Or access backend directly:</p>
          <a 
            href="http://localhost:5000/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="backend-link"
          >
            🔗 Open Backend Login
          </a>
        </div>
      </div>
    </div>
  );
}