import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminAuth.css';

const API_URL = (() => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';
  const isLocalIp = /^\d+\.\d+\.\d+\.\d+$/.test(host);
  if (isLocalHost || isLocalIp) {
    return `${protocol}//${host}:5002/api`;
  }
  return `${protocol}//${host}/api`;
})();

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const message = data?.message || `${response.status} ${response.statusText}`;
        throw new Error(message);
      }

      const token = data?.token || data?.data?.token;
      if (!token) {
        throw new Error(data?.message || 'Invalid credentials.');
      }

      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />
      <div className="auth-bg-orb auth-bg-orb-3" />

      <div className="auth-card">
        <div className="auth-card-side">
          <div className="auth-side-pattern" />
          <div className="auth-side-grid" />
          <div className="auth-side-inner">
            <div className="auth-logo-ring">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z"/>
              </svg>
            </div>
            <h2>August 93 Club</h2>
            <p>Ohanze Congress</p>
            <div className="auth-side-divider" />
            <p className="auth-side-quote">"Service for Advancement"</p>
          </div>
        </div>

        <div className="auth-card-main">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to access the admin dashboard</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <><span className="auth-spinner" />Signing in...</>
              ) : (
                <>Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Want admin access?</p>
            <Link to="/admin/register" className="auth-switch-btn">
              Apply now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}